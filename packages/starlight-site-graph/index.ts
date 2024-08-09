import type { StarlightPlugin } from '@astrojs/starlight/types'
import {validateConfig, type StarlightSiteGraphConfig} from "./config";
import integration from "./integration"

export default function plugin(userConfig?: StarlightSiteGraphConfig): StarlightPlugin {
    const parsedConfig = validateConfig(userConfig);
    return {
        name: "starlight-sitemap-plugin",
        hooks: {
            setup: async ({ addIntegration, config, logger, updateConfig }) => {
                addIntegration(integration(parsedConfig))
                const componentOverrides: typeof config.components = {};

                if (config.components?.PageSidebar) {
                    logger.warn(
                        'It looks like you already have a `PageSidebar` component override in your Starlight configuration.',
                    )
                    logger.warn(
                        'To use `starlight-site-graph`, either remove the override or manually render `starlight-site-graph/components/Graph.astro`.',
                    )
                } else {
                    componentOverrides.PageSidebar = 'starlight-site-graph/overrides/PageSidebar.astro'
                }

                updateConfig({
                    components: {
                        ...componentOverrides,
                        ...config.components,
                    }
                })
            }
        }
    };
}
