import { AstroError } from 'astro/errors';
import { z } from 'astro/zod';
import { starlightSiteGraphConfig, starlightSiteGraphConfigSchema } from './base';
import { mergeDefaults } from '../components/graph/shared/object';
import { normalizeLegacyLabelConfig } from './migrations';

export function validateConfig(baseConfig: typeof starlightSiteGraphConfig, userConfig: unknown) {
	if (userConfig && typeof userConfig === 'object' && 'graphConfig' in userConfig && userConfig.graphConfig) {
		normalizeLegacyLabelConfig(userConfig.graphConfig);
	}
	const config = starlightSiteGraphConfigSchema.safeParse(userConfig);

	if (!config.success) {
		const errors = z.flattenError(config.error);
		throw new AstroError(
			`Invalid starlight-site-graph configuration:

            ${errors.formErrors.map(formError => ` - ${formError}`).join('\n')}
            ${Object.entries(errors.fieldErrors)
				.map(([fieldName, fieldErrors]) => `- ${fieldName}: ${JSON.stringify(fieldErrors)}`)
				.join('\n')}
            `,
		);
	}

	return mergeDefaults(baseConfig, config.data);
}

export { starlightSiteGraphConfig, starlightSiteGraphConfigSchema, type StarlightSiteGraphConfig } from './base';
export { globalGraphConfig, graphConfigSchema, globalGraphConfigSchema, type GraphConfig } from './graph';
export { type SitemapEntry, type Sitemap, globalSitemapConfig, globalSitemapConfigSchema, type SitemapConfig } from './sitemap';
export {
	nodeStyleSchema, nodeStateStyleSchema, type NodeStyle, type NodeShapeType, type NodeStateStyle, type NodeStateStyles, type NodeVisualStateType,
	nodeDefaultStyle, nodeVisitedStyle, nodeCurrentStyle, nodeUnresolvedStyle, nodeExternalStyle, tagDefaultStyle
} from './node';
export { globalBacklinksConfig, globalBacklinksConfigSchema, type BacklinksConfig } from './backlinks';

export { mergeDefaults, type DeepPartial } from '../components/graph/shared/object';
