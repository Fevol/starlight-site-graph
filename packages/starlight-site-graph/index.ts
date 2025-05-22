import type { StarlightPlugin } from '@astrojs/starlight/types';
import { validateConfig, type StarlightSiteGraphConfig } from './config';

import integration from './integration';
import { translations } from './i18n';
import { ensureTrailingSlash } from './sitemap/util';

export default function plugin(userConfig?: StarlightSiteGraphConfig): StarlightPlugin {
	const parsedConfig = validateConfig(userConfig);
	return {
		name: 'starlight-sitemap-plugin',
		hooks: {
			'i18n:setup'({ injectTranslations }) {
				injectTranslations(translations);
			},
			'config:setup': async ({ addIntegration, config, astroConfig, command, logger, updateConfig }) => {
				if (command === 'preview') return;

				const addTrailingSlashes = astroConfig.trailingSlash !== "never";

				// TODO: Temporary implementation of graph/backlinks exclusion from plugin
				if (!parsedConfig.graph) {
					parsedConfig.graphConfig.visibilityRules = [];
				}
				if (!parsedConfig.backlinks) {
					parsedConfig.backlinksConfig.visibilityRules = [];
				}
				if (!(parsedConfig.graph || parsedConfig.backlinks)) {
					// EXPL: This bypasses the sitemap generation, so page contents don't have to be parsed
					parsedConfig.sitemapConfig.pageInclusionRules = [];
				}

				if (parsedConfig.sitemapConfig.ignoreStarlightLinks) {
					let starlightIgnoredLinks = [];
					if (config.credits) {
						starlightIgnoredLinks.push('!https://starlight.astro.build/');
					}

					if (config.editLink?.baseUrl) {
						starlightIgnoredLinks.push(`!${ensureTrailingSlash(config.editLink.baseUrl, addTrailingSlashes)}**`);
					}

					for (const link of Object.values(config.social ?? {})) {
						starlightIgnoredLinks.push(`!${ensureTrailingSlash(link.href, addTrailingSlashes)}`);
					}

					parsedConfig.sitemapConfig.linkInclusionRules.splice(-1, 0, ...starlightIgnoredLinks);
					logger.info('Ignoring following Starlight links in sitemap: ' + starlightIgnoredLinks.join(', '));
				}

				addIntegration(integration(parsedConfig));
				const componentOverrides: typeof config.components = {};
				const customCss: typeof config.customCss = [
					'starlight-site-graph/styles/layers.css',
					'starlight-site-graph/styles/common.css'
				];

				if (parsedConfig.overridePageSidebar) {
					if (config.components?.PageSidebar) {
						logger.warn(
							'It looks like you already have a `PageSidebar` component override in your Starlight configuration.',
						);
						logger.warn(
							'To use `starlight-site-graph`, either remove the override or manually render `starlight-site-graph/components/Graph.astro`.',
						);
						logger.info(
							"If you do not want this plugin to override your `PageSidebar` at all, you can set `overridePageSidebar` to `false` in the configuration.",
						)
					} else {
						componentOverrides.PageSidebar = 'starlight-site-graph/overrides/PageSidebar.astro';
					}
				}

				updateConfig({
					customCss: [...customCss, ...(config.customCss ?? [])],
					components: {
						...componentOverrides,
						...config.components,
					},
				});
			},
		},
	};
}
