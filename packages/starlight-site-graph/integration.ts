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
						logger.error('Failed to resolve `picomatch` package, which is required by `micromatch`. Please ensure that `picomatch` is installed as a dependency.' + e);
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
								logger.error(`Content root "${settings.sitemapConfig.contentRoot}" does not exist, please check your configuration.`);
								return;
							}

							try {
								await builder.addMDContentFolder(settings.sitemapConfig.contentRoot, settings.sitemapConfig.pageInclusionRules)
								settings.sitemapConfig.sitemap = builder.process().toSitemap();
								logger.info('Finished retrieving links from Markdown content');
							} catch (e) {
								logger.error('Failed to retrieve links from Markdown content, reason: ' + e);
								// TODO: Should virtual config always be added regardless of correct MD content generation?
								//		Failsafe?
								return;
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

					addVirtualImports(args, {
						name,
						imports: {
							'virtual:starlight-site-graph/config': `export default ${JSON.stringify(settings)}`,
							'virtual:starlight-site-graph/astro-config': `export default ${JSON.stringify(config)}`,
						},
					});

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
							"Output directory couldn't be determined, graph sitemap will not make use of HTML content.",
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
							settings.sitemapConfig.sitemap = builder.process().toSitemap();
							logger.error('Failed to retrieve links from generated HTML content, reason: ' + e);
						}
					}

					await fs.promises.mkdir(`${outputPath}/sitegraph`, { recursive: true });
					await fs.promises.writeFile(`${outputPath}/sitegraph/sitemap.json`,
						JSON.stringify(settings.sitemapConfig.sitemap, null, settings.debug ? 2 : 0)
					);
					logger.info("`sitemap.json` created at `dist/sitegraph`");
				}
			}
		};
	},
});
