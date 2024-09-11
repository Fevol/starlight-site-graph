import fs from 'node:fs';

import { addVirtualImports, defineIntegration } from 'astro-integration-kit';

import { starlightSiteGraphConfigSchema } from './config';
import { SiteMapBuilder } from './sitemap/build';
import { processSitemap } from './sitemap/process';

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

		return {
			hooks: {
				'astro:config:setup': async params => {
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

						// Try to load 'pixi-stats' only if it's available
						try {
							pixiStatsPlugin = require('pixi-stats').default();  // adapt if necessary
						} catch (err) {
							params.logger.warn('Failed to load `pixi-stats`, to enable the FPS counter for the graph view, make sure `pixi-stats` is installed as aa peer dependency.');
						}

						params.updateConfig({
							vite: {
								plugins: [
									...(pixiStatsPlugin ? [pixiStatsPlugin] : []),
								],
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
					const outputPath = params.dir.pathname.slice(1);
					if (!Object.keys(options.sitemapConfig.sitemap!).length) {
						params.logger.info('Retrieving links from generated HTML content');
						options.sitemapConfig.sitemap = (await builder
							.setBasePath(outputPath)
							.addHTMLContentFolder(outputPath, sitemapConfig.pageInclusionRules))
							.process()
							.toSitemap();
						params.logger.info('Finished generating sitemap from generated HTML content');
					}

					await fs.promises.mkdir(`${outputPath}/sitegraph`, { recursive: true });
					await fs.promises.writeFile(`${outputPath}/sitegraph/sitemap.json`, JSON.stringify(options.sitemapConfig.sitemap, null, 2));
				}
			}
		};
	},
});
