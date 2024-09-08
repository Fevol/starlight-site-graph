import { z } from 'astro/zod';
import { AstroError } from 'astro/errors';
import { graphConfigSchema, nodeStyle } from './config';

const pageGraphConfigSchema = graphConfigSchema.extend({
	/**
	 * Whether the graph component should be visible for this page, has precedence over global rules
	 */
	visible: z.boolean().optional(),

	/**
	 * Custom styles for the node defined by this page
	 * Overrides any other styles that may be applied to this node
	 */
	nodeStyle: nodeStyle.partial().optional(),
});
export type PageGraphConfig = z.infer<typeof pageGraphConfigSchema>;

const pageSitemapConfigSchema = z.object({
	/**
	 * Whether the page should be included in the sitemap, has precedence over global rules
	 *
	 * @optional
	 */
	include: z.boolean().optional(),
	/**
	 * Determine for this page which links are included in the sitemap.
	 * The link is included/excluded if the link's target _path_ matches one of the rules.
	 * When a rule starts with `!`, the link is _excluded_ if matched.
	 * Rules are evaluated in order, the first matching rule determines the inclusion of the link.
	 * These rules have precedence over global rules.
	 *
	 * @optional
	 * @example Only include links to endpoints in the "api" subdirectory:
	 * ["api/**"]
	 * @example Include all links except those to the "secret" subdirectory:
	 * ["!secret/**", "**\/*"]
	 */
	linkInclusionRules: z.array(z.string()).default([]),
});

export type PageSitemapConfig = z.infer<typeof pageSitemapConfigSchema>;

const pageFrontmatterSchema = z.object({
	/**
	 * The title of the page
	 *
	 * @required
	 */
	title: z.string(),
	/**
	 * Specify direct links to other pages of the site
	 *
	 * @optional
	 */
	links: z.array(z.string()).optional(),
	/**
	 * Tags linked to this page
	 *
	 * @optional
	 */
	tags: z.array(z.string()).optional(),
	/**
	 * Configuration for the sitemap
	 *
	 * @optional
	 */
	sitemap: pageSitemapConfigSchema.default({
		linkInclusionRules: ['**/*'],
	}),
	/**
	 * Configuration for the graph component for this page
	 *
	 * Overrides global graph configuration
	 *
	 * @optional
	 */
	graph: pageGraphConfigSchema.optional(),
});
export type PageFrontmatter = z.infer<typeof pageFrontmatterSchema>;

export const pageConfigSchema = z.object({
	/**
	 * Specify direct links to other pages of the site
	 */
	links: z.array(z.string()).optional(),
	/**
	 * Tags linked to this page
	 */
	tags: z.array(z.string()).optional(),
	sitemap: z
		.object({
			/**
			 * Whether the page should be excluded from the sitemap, has precedence over global rules
			 */
			include: z.boolean().optional(),
			/**
			 * Which links of this page may be included in the sitemap
			 */
			linkInclusionRules: z.array(z.string()).default(['**/*']),
		})
		.default({
			linkInclusionRules: ['**/*'],
		}),
	graph: graphConfigSchema
		.extend({
			/**
			 * Whether the graph component should be visible for this page, has precedence over global rules
			 */
			visible: z.boolean().optional(),
		})
		.partial()
		.optional(),
	backlinks: z
		.object({
			/**
			 * Whether the backlinks component should be visible for this page, has precedence over global rules
			 */
			visible: z.boolean().optional(),
		})
		.partial()
		.optional(),
});

interface SchemaContext {
	// image: ImageFunction
}

export function pageSchema(context: SchemaContext) {
	// Checking for `context` to provide a better migration error message.
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!context) {
		throw new AstroError(
			'Missing page config schema validation context.',
			`You may need to update your content collections configuration in the \`src/content/config.ts\` file and pass the context to the \`pageSchema\` function:

\`docs: defineCollection({ schema: docsSchema({ extend: (context) => pageSchema(context) }) })\`

If you believe this is a bug, please file an issue at https://github.com/Fevol/starlight-site-graph/issues/new`,
		);
	}

	return pageConfigSchema;
}
