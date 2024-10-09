import type { StarlightPlugin } from '@astrojs/starlight/types';
import { validateConfig, type StarlightSiteGraphConfig } from './config';
import integration from './integration';
import { translations } from './i18n';

export default function plugin(userConfig?: StarlightSiteGraphConfig): StarlightPlugin {
	const parsedConfig = validateConfig(userConfig);
	return {
		name: 'starlight-sitemap-plugin',
		hooks: {
			setup: async ({ addIntegration, config, logger, updateConfig, injectTranslations }) => {
				addIntegration(integration(parsedConfig));
				const componentOverrides: typeof config.components = {};
				const customCss: typeof config.customCss = ['starlight-site-graph/styles/common.css'];

				injectTranslations(translations);

				if (config.components?.PageSidebar) {
					logger.warn(
						'It looks like you already have a `PageSidebar` component override in your Starlight configuration.',
					);
					logger.warn(
						'To use `starlight-site-graph`, either remove the override or manually render `starlight-site-graph/components/Graph.astro`.',
					);
				} else {
					componentOverrides.PageSidebar = 'starlight-site-graph/overrides/PageSidebar.astro';
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
