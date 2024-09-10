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
							options.sitemapConfig.sitemap = params.command !== 'dev' ? {}
								: (await builder
									.addMDContentFolder(sitemapConfig.contentRoot, sitemapConfig.pageInclusionRules))
									.process()
									.toSitemap();
							params.logger.info('Finished generating sitemap from site content');
						}
					} else {
						params.logger.info('Using applied sitemap');
						options.sitemapConfig.sitemap = processSitemap(options.sitemapConfig.sitemap, options);
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
					params.logger.info('Retrieving links from generated HTML content');
					if (!Object.keys(options.sitemapConfig.sitemap!).length) {
						options.sitemapConfig.sitemap = (await builder
							.addHTMLContentFolder(params.dir.pathname))
							.process()
							.toSitemap();
					}

					await fs.promises.mkdir('public/sitegraph', { recursive: true });
					await fs.promises.writeFile('public/sitegraph/sitemap.json', JSON.stringify(options.sitemapConfig.sitemap, null, 2));
				}
			}
		};
	},
});
