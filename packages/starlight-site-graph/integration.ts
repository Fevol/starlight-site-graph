import fs from 'node:fs';

import { addVirtualImports, defineIntegration } from 'astro-integration-kit';

import { fileURLToPath } from 'node:url';

import { starlightSiteGraphConfigSchema, type FullStarlightSiteGraphConfig, validateConfig } from './config';
import { SiteMapBuilder } from './sitemap/build';
import { processSitemap } from './sitemap/process';
import { trimSlashes } from './sitemap/util';

/**
 * Generates a static sitemap for all md files in the docs directory inside public/sitemap.json,
 * consumed by graph generating code
 */
export default defineIntegration({
	name: 'starlight-site-graph-integration',
	optionsSchema: starlightSiteGraphConfigSchema,
	setup({ name, options }) {
		if (!options.starlight) {
			options = { starlight: false, ...validateConfig(options) };
		}
		let settings = options as FullStarlightSiteGraphConfig;

		const builder = new SiteMapBuilder(settings.sitemapConfig);
		const sitemapProvided = !!settings.sitemapConfig.sitemap;
		let outputPath: string;

		return {
			hooks: {
				'astro:config:setup': async (args) => {
					const { config, logger, command, updateConfig, injectScript } = args;

					// Track if sitemap generation was successful
					let sitemapGenerationFailed = false;
					let sitemapErrorMessage = '';

					try {
						// EXPL: This prevents an error where an older version of `picomatch` (2.3.1),
						//     included via `anymatch` < `unstorage` < `astro`, is used instead of the
						//	   newer version (4.0.3), which does not use the Node `process` on the client side.
						//     This caused issues in the browser, as `process` is not defined there.
						//     If you do still encounter an error despite this bodge, please open an issue.
						updateConfig({
							vite: {
								plugins: [
									{
										name: 'picomatch-process-polyfill',
										// EXPL: We define a fake `process.platform` polyfill to prevent errors.
										//       Inside `picomatch`, the `process.platform` variable is used to check whether
										//        a) the platform is Windows (but this is also inferable from other variables)
										//        b) regex support for lookbehinds is available (not used in the plugin)
										transform(code, id) {
											if (id.includes('picomatch') || id.includes('micromatch') || id.includes('anymatch')) {
												if (code.includes("process.platform")) {
													logger.warn(`Incompatible \`picomatch\` version detected, automatic patch applied\nTo get rid of this error, add the following to your package.json and reinstall:\n"overrides": {\n\t"picomatch": "^4.0.3"\n}`);
													return code.replace(/process\.platform/g, '"undefined"');
												}
											}
										}
									}
								],
								optimizeDeps: {
									include: ['picomatch', 'micromatch', 'anymatch'],
								}
							}
						});
					} catch (e) {
						logger.error(
							`Failed to apply picomatch compatibility patch. This may cause runtime errors in the browser.\n` +
							`Cause: ${e instanceof Error ? e.message : String(e)}\n` +
							`Fix: Ensure 'picomatch' is installed and add to package.json overrides: { "picomatch": "^4.0.3" }`
						);
					}

					if (!settings.sitemapConfig.contentRoot) {
						settings.sitemapConfig.contentRoot = trimSlashes(config.srcDir.pathname);
						if (settings.starlight) {
							settings.sitemapConfig.contentRoot += "/content/docs";
						} else {
							settings.sitemapConfig.contentRoot += "/pages";
						}
					}

					const addTrailingSlash = config.trailingSlash !== 'never';
					builder.setContentRoot(settings.sitemapConfig.contentRoot);
					builder.setTrailingSlash(addTrailingSlash);

					// TODO: Figure if it is somehow possible to conditionally import astro:prefetch without triggering vite errors
					if (!config.prefetch) {
						logger.warn('`prefetch` is disabled in the Astro config, but this plugin requires it to prevent errors. This option has now been enabled.');
						config.prefetch = true;
					}

					// Adapted from @shishkin/astro-pagefind
					if (config.adapter?.name.startsWith("@astrojs/vercel")) {
						outputPath = fileURLToPath(new URL(".vercel/output/static/", config.root));
					} else if (config.adapter?.name === "@astrojs/cloudflare") {
						outputPath = fileURLToPath(new URL(config.base?.replace(/^\//, ""), config.outDir));
					} else if (config.adapter?.name === "@astrojs/node" && config.output === "server") {
						outputPath = fileURLToPath(config.build.client!);
					} else {
						outputPath = fileURLToPath(config.outDir);
					}

					if (!sitemapProvided) {
						logger.info(
							'Retrieving links from Markdown content' +
							(settings.sitemapConfig.pageInclusionRules.length
								? ` (with patterns ${settings.sitemapConfig.pageInclusionRules.join(', ')})`
								: ''),
						);

						// Generate sitemap (links, backlinks, tags, nodeStyle) from markdown content
						if (command === 'dev' || command === 'build') {
							builder.setBasePath(config.base);
							try {
								await fs.promises.access(settings.sitemapConfig.contentRoot);
							} catch (e) {
								const error = e instanceof Error ? e : new Error(String(e));
								sitemapGenerationFailed = true;
								sitemapErrorMessage = `Content directory not found: "${settings.sitemapConfig.contentRoot}"`;

								logger.error(
									`${sitemapErrorMessage}\n` +
									`  Cause: ${error.message}\n` +
									`  Fix: Ensure the content directory exists, or specify a custom path via 'sitemapConfig.contentRoot'\n` +
									`  Note: The site graph will continue with an empty sitemap. Create the directory and restart to enable the graph.`
								);

								// Initialize with empty sitemap to allow integration to continue
								settings.sitemapConfig.sitemap = builder.process().toSitemap();
							}

							// Only attempt to add content if directory exists
							if (!sitemapGenerationFailed) {
								try {
									await builder.addMDContentFolder(settings.sitemapConfig.contentRoot, settings.sitemapConfig.pageInclusionRules)
									settings.sitemapConfig.sitemap = builder.process().toSitemap();
									logger.info('Finished retrieving links from Markdown content');
								} catch (e) {
									const error = e instanceof Error ? e : new Error(String(e));
									sitemapGenerationFailed = true;
									sitemapErrorMessage = 'Failed to process Markdown content';

									logger.error(
										`${sitemapErrorMessage}\n` +
										`  Cause: ${error.message}\n` +
										`  Stack: ${error.stack || 'Not available'}\n` +
										`  Fix: Check that Markdown files are valid and accessible. The site graph will continue with an empty sitemap.`
									);

									// Initialize with empty sitemap to allow integration to continue
									settings.sitemapConfig.sitemap = builder.process().toSitemap();
								}
							}
						}
					} else {
						logger.info('Using applied sitemap');
						settings.sitemapConfig.sitemap = processSitemap(settings.sitemapConfig.sitemap, settings);
					}

					if (command === 'dev' && settings.debug) {
						let pixiStatsPlugin = null;
						try {
							pixiStatsPlugin = require('pixi-stats').default();
						} catch (err) {
							logger.warn('Failed to load `pixi-stats`, to enable the FPS counter for the graph view, make sure `pixi-stats` is installed as aa peer dependency.');
						}

						updateConfig({
							vite: {
								plugins: pixiStatsPlugin ? [pixiStatsPlugin] : [],
								ssr: {
									noExternal: ['pixi-stats'],
								},
							},
						});
					}

					// NOTE: Prevents a possible issue in dev mode where micromatch is not properly bundled
					if (command === 'dev') {
						updateConfig({
							vite: {
								optimizeDeps: {
									include: ['micromatch'],
								}
							}
						});
					}

					// Always add virtual imports, even if sitemap generation failed
					// This ensures the integration continues to work with an empty graph
					addVirtualImports(args, {
						name,
						imports: {
							'virtual:starlight-site-graph/config': `export default ${JSON.stringify(settings)}`,
							'virtual:starlight-site-graph/astro-config': `export default ${JSON.stringify(config)}`,
						},
					});

					// Warn user if running in degraded mode
					if (sitemapGenerationFailed) {
						logger.warn(
							`Site graph is running in DEGRADED MODE with an empty sitemap.\n` +
							`  Reason: ${sitemapErrorMessage}\n` +
							`  Impact: The graph visualization will be empty until content is available.\n` +
							`  Action: Fix the issue above and restart the dev server or rebuild.`
						);
					}

					injectScript("page", `
						import config from 'virtual:starlight-site-graph/config';
						if (config.trackVisitedPages !== 'disable') {
							const storage = config.trackVisitedPages === 'session' ? sessionStorage : localStorage;
							const visited = new Set(JSON.parse(storage.getItem('starlight-site-graph--visited-pages') ?? '[]'));
							visited.add(new URL(window.location.href).pathname.slice(1));
							storage.setItem('starlight-site-graph--visited-pages', JSON.stringify([...visited]));
						}
					`)
				},
				'astro:config:done': async (args) => {
					const { injectTypes } = args;

					injectTypes({
						filename: "types.d.ts",
						content: `declare module 'virtual:starlight-site-graph/config' {
							export default ${JSON.stringify(settings)};
						}
						
						declare module 'virtual:starlight-site-graph/astro-config' {
							export default ${JSON.stringify(args.config)};
						}`
					});
				},
				'astro:build:done': async (args) => {
					const { logger } = args;

					if (!outputPath) {
						logger.warn(
							`Output directory couldn't be determined. The graph sitemap will not include HTML content.\n` +
							`  Impact: Links and metadata extracted from HTML will be missing.\n` +
							`  Note: The sitemap will still be created with available Markdown content.`
						);
					}

					if (!sitemapProvided) {
						logger.info('Retrieving links from generated HTML content');
						try {
							await fs.promises.access(outputPath);
							settings.sitemapConfig.sitemap = (await builder
								.addHTMLContentFolder(outputPath, settings.sitemapConfig.pageInclusionRules))
								.process()
								.toSitemap();
							logger.info('Finished generating sitemap from generated HTML content');
						} catch (e) {
							const error = e instanceof Error ? e : new Error(String(e));

							// Fall back to markdown-only sitemap
							settings.sitemapConfig.sitemap = builder.process().toSitemap();

							logger.warn(
								`Failed to retrieve links from generated HTML content. Falling back to Markdown-only sitemap.\n` +
								`  Cause: ${error.message}\n` +
								`  Impact: The sitemap will be based on Markdown content only. HTML-specific links may be missing.\n` +
								`  Fix: Ensure the build completed successfully and the output directory is accessible.`
							);
						}
					}

					try {
						await fs.promises.mkdir(`${outputPath}/sitegraph`, { recursive: true });
						await fs.promises.writeFile(`${outputPath}/sitegraph/sitemap.json`,
							JSON.stringify(settings.sitemapConfig.sitemap, null, settings.debug ? 2 : 0)
						);

						const nodeCount = settings.sitemapConfig.sitemap?.['nodes'] ? Object.keys(settings.sitemapConfig.sitemap['nodes']).length : 0;
						const linkCount = settings.sitemapConfig.sitemap?.['links'] ? Object.keys(settings.sitemapConfig.sitemap['links']).length : 0;

						logger.info(
							`Sitemap created at 'dist/sitegraph/sitemap.json' with ${nodeCount} nodes and ${linkCount} links`
						);
					} catch (e) {
						const error = e instanceof Error ? e : new Error(String(e));
						logger.error(
							`Failed to write sitemap file to disk.\n` +
							`  Cause: ${error.message}\n` +
							`  Impact: The site graph will not be available on the deployed site.\n` +
							`  Fix: Check disk space and write permissions for the output directory.`
						);
						throw error; // Re-throw to fail the build
					}
				}
			}
		};
	},
});
