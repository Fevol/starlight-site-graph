import type { StarlightPlugin } from '@astrojs/starlight/types';
import { validateConfig, type StarlightSiteGraphConfig } from './config';

import integration from './integration';
import { translations } from './i18n';

export default function plugin(userConfig?: StarlightSiteGraphConfig): StarlightPlugin {
	const parsedConfig = validateConfig(userConfig);
	return {
		name: 'starlight-site-graph-plugin',
		hooks: {
			'i18n:setup'({ injectTranslations }) {
				injectTranslations(translations);
			},
			'config:setup': async ({ addIntegration, config, astroConfig, command, logger, updateConfig }) => {
				if (command === 'preview') return;

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

				// EXPL: Pass a starlight flag to the integration, if none is given, all starlight-specific features are disabled
				addIntegration(integration({ ...parsedConfig, starlight: true }));
				const componentOverrides: typeof config.components = {};
				const customCss: typeof config.customCss = [
					'starlight-site-graph/styles/layers.css',
					'starlight-site-graph/styles/common.css',
					'starlight-site-graph/styles/starlight.css',
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
					customCss: [...(config.customCss ?? []), ...customCss],
					components: {
						...componentOverrides,
						...config.components,
					},
				});
			},
		},
	};
}
