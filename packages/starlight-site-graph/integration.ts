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
				'astro:config:setup': async params => {
					// Adapted from @shishkin/astro-pagefind
					if (params.config.adapter?.name.startsWith("@astrojs/vercel")) {
						outputPath = fileURLToPath(new URL(".vercel/output/static/", params.config.root));
					} else if (params.config.adapter?.name === "@astrojs/cloudflare") {
						outputPath = fileURLToPath(new URL(params.config.base?.replace(/^\//, ""), params.config.outDir));
					} else if (params.config.adapter?.name === "@astrojs/node" && params.config.output === "hybrid") {
						outputPath = fileURLToPath(params.config.build.client!);
					} else {
						outputPath = fileURLToPath(params.config.outDir);
					}

					if (!options.sitemapConfig.sitemap) {
						params.logger.info(
							'Retrieving links from Markdown content' +
							(sitemapConfig.pageInclusionRules.length
								? ` (with patterns ${sitemapConfig.pageInclusionRules.join(', ')})`
								: ''),
						);

						// Generate sitemap (links, backlinks, tags, nodeStyle) from markdown content
						if (params.command === 'dev' || params.command === 'build') {
							builder.setBasePath(params.config.base);
							await builder.addMDContentFolder(sitemapConfig.contentRoot, sitemapConfig.pageInclusionRules)
							options.sitemapConfig.sitemap = params.command === 'dev' ? builder.process().toSitemap() : {};
							params.logger.info('Finished retrieving links from Markdown content');
						}
					} else {
						params.logger.info('Using applied sitemap');
						options.sitemapConfig.sitemap = processSitemap(options.sitemapConfig.sitemap, options);
					}

					if (params.command === 'dev' && options.debug) {
						let pixiStatsPlugin = null;
						try {
							pixiStatsPlugin = require('pixi-stats').default();
						} catch (err) {
							params.logger.warn('Failed to load `pixi-stats`, to enable the FPS counter for the graph view, make sure `pixi-stats` is installed as aa peer dependency.');
						}

						params.updateConfig({
							vite: {
								plugins: pixiStatsPlugin ? [pixiStatsPlugin] : [],
								ssr: {
									noExternal: ['pixi-stats'],
								},
							},
						});
					}

					addVirtualImports(params, {
						name,
						imports: {
							'virtual:starlight-site-graph/config': `export default ${JSON.stringify(options)}`,
							'virtual:starlight-site-graph/astro-config': `export default ${JSON.stringify(params.config)}`,
						},
					});

					params.injectScript("page", `
						import config from 'virtual:starlight-site-graph/config';
						if (config.trackVisitedPages) {
							const storage = config.storageLocation === 'session' ? sessionStorage : localStorage;
							const visited = new Set(JSON.parse(storage.getItem(config.storageKey + 'visited') ?? '[]'));
							visited.add(new URL(window.location.href).pathname.slice(1));
							storage.setItem(config.storageKey + 'visited', JSON.stringify([...visited]));
						}
					`)
				},
				'astro:build:done': async params => {
					if (!outputPath) {
						params.logger.warn(
							"Output directory couldn't be determined, graph sitemap will not make use of HTML content.",
						);
					}

					if (!Object.keys(options.sitemapConfig.sitemap!).length) {
						params.logger.info('Retrieving links from generated HTML content');
						try {
							await fs.promises.access(outputPath);
							options.sitemapConfig.sitemap = (await builder
								.setBasePath(outputPath)
								.addHTMLContentFolder(outputPath, sitemapConfig.pageInclusionRules))
								.process()
								.toSitemap();
							params.logger.info('Finished generating sitemap from generated HTML content');
						} catch (e) {
							options.sitemapConfig.sitemap = builder.process().toSitemap();
							params.logger.error('Failed to retrieve links from generated HTML content, reason: ' + e);
						}
					}

					await fs.promises.mkdir(`${outputPath}/sitegraph`, { recursive: true });
					await fs.promises.writeFile(`${outputPath}/sitegraph/sitemap.json`, JSON.stringify(options.sitemapConfig.sitemap, null, 2));
					params.logger.info("`sitemap.json` created at `dist/sitegraph`");
				}
			}
		};
	},
});
