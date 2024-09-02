import { z } from 'astro/zod';
import { AstroError } from 'astro/errors';
import {type GraphConfig, graphConfigSchema} from "./config";


export interface PageGraphConfig extends GraphConfig {
	visible?: boolean;
}

export interface PageSitemapConfig {
	include: boolean;
	linkRules: string[];
}

export interface PageConfig {
	title: string;
	links?: string | string[];
	tags?: string | string[];

	sitemap?: PageSitemapConfig;
	graph?: PageGraphConfig;
}

export const pageConfigSchema = z.object({
	/**
	 * Specify direct links to other pages of the site
	 */
	links: z.array(z.string()).optional(),
	/**
	 * Tags linked to this page
	 */
	tags: z.array(z.string()).optional(),
	sitemap: z.object({
		/**
		 * Whether the page should be excluded from the sitemap, has precedence over global rules
		 */
		include: z.boolean().optional(),
		/**
		 * Which links of this page can be included in the sitemap
		 */
		linkRules: z.array(z.string()).default(["**/*"]),
	}).default({
		linkRules: ["**/*"],
	}),
	graph: graphConfigSchema.extend({
		/**
		 * Whether the graph component should be visible for this page, has precedence over global rules
		 */
		visible: z.boolean().optional(),
	}).partial().optional(),
});

interface SchemaContext {
	// image: ImageFunction
}

export function pageSchema(context: SchemaContext) {
	// Checking for `context` to provide a better migration error message.
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!context) {
		throw new AstroError(
			'Missing graph config schema validation context.',
			`You may need to update your content collections configuration in the \`src/content/config.ts\` file and pass the context to the \`graphSchema\` function:

\`docs: defineCollection({ schema: docsSchema({ extend: (context) => graphSchema(context) }) })\`

If you believe this is a bug, please file an issue at https://github.com/Fevol/starlight-site-graph/issues/new`,
		);
	}

	return pageConfigSchema;
}
