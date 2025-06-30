import fs from 'node:fs';

import { addVirtualImports, defineIntegration } from 'astro-integration-kit';

import { starlightSiteGraphConfigSchema, type FullStarlightSiteGraphConfig } from './config';
import { SiteMapBuilder } from './sitemap/build';
import { processSitemap } from './sitemap/process';
import { onlyTrailingSlash } from './sitemap/util';

import { fileURLToPath } from 'node:url';


/**
 * Generates a static sitemap for all md files in the docs directory inside public/sitemap.json,
 * consumed by graph generating code
 */
export default defineIntegration({
	name: 'starlight-sitemap-integration',
	optionsSchema: starlightSiteGraphConfigSchema,
	setup({ name, options }) {
		let settings = options as FullStarlightSiteGraphConfig;
		const builder = new SiteMapBuilder(settings.sitemapConfig);
		let outputPath: string;
		const sitemapProvided = !!settings.sitemapConfig.sitemap;

		return {
			hooks: {
				'astro:config:setup': async (args) => {
					const { config, logger, command, updateConfig, injectScript } = args;
					const addTrailingSlash = config.trailingSlash !== 'never';
					builder.setTrailingSlash(addTrailingSlash);

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

						if (settings.sitemapConfig.ignoreStarlightLinks) {
							let starlightIgnoredLinks = [`!${config.base}`];
							settings.sitemapConfig.linkInclusionRules.splice(-1, 0, ...starlightIgnoredLinks);
							settings.sitemapConfig.linkInclusionRules = settings.sitemapConfig.linkInclusionRules
								.map(x => onlyTrailingSlash(x, addTrailingSlash));

							logger.info('Ignoring following Starlight links in sitemap: ' +
										settings.sitemapConfig.linkInclusionRules.join(', '));
						}

						// Generate sitemap (links, backlinks, tags, nodeStyle) from markdown content
						if (command === 'dev' || command === 'build') {
							builder.setBasePath(config.base);
							try {
								await fs.promises.access(settings.sitemapConfig.contentRoot);
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
					await fs.promises.writeFile(`${outputPath}/sitegraph/sitemap.json`, JSON.stringify(settings.sitemapConfig.sitemap, null, 2));
					logger.info("`sitemap.json` created at `dist/sitegraph`");
				}
			}
		};
	},
});
