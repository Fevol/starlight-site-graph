import { AstroError } from 'astro/errors';
import { starlightSiteGraphConfig, starlightSiteGraphConfigSchema } from './base';

function isObject(item: unknown): item is Record<string, unknown> {
	return (item !== null && typeof item === 'object' && !Array.isArray(item));
}

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Record<string, unknown>
		? DeepPartial<T[P]> | undefined
		: T[P] | undefined;
};

export function mergeDefaults<T extends Record<string, unknown>>(base: T, patch: DeepPartial<T>): T {
	const result: Record<string, unknown> = { ...base };
	for (const key of Object.keys(base)) {
		if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
			continue;
		}

		const baseValue = result[key];
		const patchValue = patch[key];

		if (isObject(patchValue) && isObject(baseValue)) {
			result[key] = mergeDefaults(baseValue, patchValue);
		} else if (patchValue !== undefined) {
			result[key] = patchValue;
		}
	}

	return result as T;
}

export function validateConfig(baseConfig: typeof starlightSiteGraphConfig, userConfig: unknown) {
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

	return mergeDefaults(baseConfig, config.data);
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
	nodeStyleSchema, type NodeStyle, type NodeShapeType,
	nodeDefaultStyle, nodeVisitedStyle, nodeCurrentStyle, nodeUnresolvedStyle, nodeExternalStyle, tagDefaultStyle
} from './node';
export { globalBacklinksConfig, globalBacklinksConfigSchema, type BacklinksConfig } from './backlinks';
