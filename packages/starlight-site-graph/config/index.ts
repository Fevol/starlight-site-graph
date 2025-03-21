import { AstroError } from 'astro/errors';
import { type StarlightSiteGraphConfig, starlightSiteGraphConfig, starlightSiteGraphConfigSchema } from './base';

function isObject(item: any): boolean {
	return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Adapted from https://stackoverflow.com/a/37164538/23278914
 */
function deepMerge(target: any, source: any): any {
	let output = Object.assign({}, target);
	if (isObject(target) && isObject(source)) {
		for (const [key, value] of Object.entries(source)) {
			if (isObject(value)) {
				if (!(key in target))
					Object.assign(output, { [key]: value });
				else
					output[key] = deepMerge(target[key], value);
			} else {
				Object.assign(output, { [key]: value });
			}
		}
	}
	return output;
}

export function validateConfig(userConfig: unknown) {
	const config = starlightSiteGraphConfigSchema.safeParse(userConfig);

	if (!config.success) {
		const errors = config.error.flatten();
		throw new AstroError(
			`Invalid starlight-site-graph configuration:

            ${errors.formErrors.map(formError => ` - ${formError}`).join('\n')}
            ${Object.entries(errors.fieldErrors)
				.map(([fieldName, fieldErrors]) => `- ${fieldName}: ${JSON.stringify(fieldErrors)}`)
				.join('\n')}
            `,
		);
	}

	// TODO: Investigate how to apply Required<> to inferred type of schema, so comments still stay
	// Merge with default settings
	return deepMerge(starlightSiteGraphConfig, config.data) as typeof starlightSiteGraphConfig;
}


export type RemoveOptional<T> =
	T extends (...args: any[]) => any ? T
		: T extends object
			? { [K in keyof T]-?: RemoveOptional<NonNullable<T[K]>> }
			: T;


export type FullStarlightSiteGraphConfig = RemoveOptional<StarlightSiteGraphConfig>;
export { starlightSiteGraphConfig, starlightSiteGraphConfigSchema, type StarlightSiteGraphConfig } from './base';
export { globalGraphConfig, graphConfigSchema, globalGraphConfigSchema, type GraphConfig } from './graph';
export { type SitemapEntry, type Sitemap, globalSitemapConfig, globalSitemapConfigSchema, type SitemapConfig } from './sitemap';
export {
	nodeStyleSchema, type NodeStyle,
	nodeDefaultStyle, nodeVisitedStyle, nodeCurrentStyle, nodeUnresolvedStyle, nodeExternalStyle, tagDefaultStyle
} from './node';
export { globalBacklinksConfig, globalBacklinksConfigSchema, type BacklinksConfig } from './backlinks';
