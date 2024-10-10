import fs from 'node:fs';

import { addVirtualImports, defineIntegration } from 'astro-integration-kit';

import { starlightSiteGraphConfigSchema } from './config';
import { SiteMapBuilder } from './sitemap/build';
import { processSitemap } from './sitemap/process';

import { fileURLToPath } from 'node:url';

/**
 * Generates a static sitemap for all md files in the docs directory inside public/sitemap.json,
 * consumed by graph generating code
 */
export default defineIntegration({
	name: 'starlight-sitemap-integration',
	optionsSchema: starlightSiteGraphConfigSchema,
	setup({ name, options }) {
		const { sitemapConfig } = options;
		const builder = new SiteMapBuilder(sitemapConfig);
		let outputPath: string;

		return {
			hooks: {
				'astro:config:setup': async (args) => {
					const { config, logger, command, updateConfig, injectScript } = args;

					// Adapted from @shishkin/astro-pagefind
					if (config.adapter?.name.startsWith("@astrojs/vercel")) {
						outputPath = fileURLToPath(new URL(".vercel/output/static/", config.root));
					} else if (config.adapter?.name === "@astrojs/cloudflare") {
						outputPath = fileURLToPath(new URL(config.base?.replace(/^\//, ""), config.outDir));
					} else if (config.adapter?.name === "@astrojs/node" && config.output === "hybrid") {
						outputPath = fileURLToPath(config.build.client!);
					} else {
						outputPath = fileURLToPath(config.outDir);
					}

					if (!options.sitemapConfig.sitemap) {
						logger.info(
							'Retrieving links from Markdown content' +
							(sitemapConfig.pageInclusionRules.length
								? ` (with patterns ${sitemapConfig.pageInclusionRules.join(', ')})`
								: ''),
						);

						// Generate sitemap (links, backlinks, tags, nodeStyle) from markdown content
						if (command === 'dev' || command === 'build') {
							builder.setBasePath(config.base);
							try {
								await fs.promises.access(sitemapConfig.contentRoot);
								await builder.addMDContentFolder(sitemapConfig.contentRoot, sitemapConfig.pageInclusionRules)
								options.sitemapConfig.sitemap = command === 'dev' ? builder.process().toSitemap() : {};
								logger.info('Finished retrieving links from Markdown content');
							} catch (e) {
								logger.error('Failed to retrieve links from Markdown content, reason: ' + e);
								return;
							}
						}
					} else {
						logger.info('Using applied sitemap');
						options.sitemapConfig.sitemap = processSitemap(options.sitemapConfig.sitemap, options);
					}

					if (command === 'dev' && options.debug) {
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

					addVirtualImports(args, {
						name,
						imports: {
							'virtual:starlight-site-graph/config': `export default ${JSON.stringify(options)}`,
							'virtual:starlight-site-graph/astro-config': `export default ${JSON.stringify(config)}`,
						},
					});

					injectScript("page", `
						import config from 'virtual:starlight-site-graph/config';
						if (config.trackVisitedPages) {
							const storage = config.storageLocation === 'session' ? sessionStorage : localStorage;
							const visited = new Set(JSON.parse(storage.getItem(config.storageKey + 'visited') ?? '[]'));
							visited.add(new URL(window.location.href).pathname.slice(1));
							storage.setItem(config.storageKey + 'visited', JSON.stringify([...visited]));
						}
					`)
				},
				'astro:config:done': async (args) => {
					const { injectTypes } = args;

					injectTypes({
						filename: "types.d.ts",
						content: `declare module 'virtual:starlight-site-graph/config' {
							export default ${JSON.stringify(options)};
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

					if (!Object.keys(options.sitemapConfig.sitemap!).length) {
						logger.info('Retrieving links from generated HTML content');
						try {
							await fs.promises.access(outputPath);
							options.sitemapConfig.sitemap = (await builder
								.setBasePath(outputPath)
								.addHTMLContentFolder(outputPath, sitemapConfig.pageInclusionRules))
								.process()
								.toSitemap();
							logger.info('Finished generating sitemap from generated HTML content');
						} catch (e) {
							options.sitemapConfig.sitemap = builder.process().toSitemap();
							logger.error('Failed to retrieve links from generated HTML content, reason: ' + e);
						}
					}

					await fs.promises.mkdir(`${outputPath}/sitegraph`, { recursive: true });
					await fs.promises.writeFile(`${outputPath}/sitegraph/sitemap.json`, JSON.stringify(options.sitemapConfig.sitemap, null, 2));
					logger.info("`sitemap.json` created at `dist/sitegraph`");
				}
			}
		};
	},
});
