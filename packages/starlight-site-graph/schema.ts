import { z } from 'astro/zod';
import { graphConfigSchema, nodeStyleSchema } from './config';

const pageGraphConfigSchema = graphConfigSchema.extend({
	/**
	 * Whether the graph component should be visible for this page, has precedence over global rules
	 */
	visible: z.boolean().optional(),

	/**
	 * Custom styles for the node defined by this page
	 * Overrides any other styles that may be applied to this node
	 */
	nodeStyle: nodeStyleSchema.partial().optional(),
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
	 * Specifies the title of the page in the sitemap (and thus graph and backlinks). \
	 * If not provided, either the `title` frontmatter field, the global `pageTitles` setting,
	 *   or the last part of the page's path is used as the title
	 * Otherwise, the `pageTitle` overrides all other title sources.
	 *
	 * @optional
	 */
	pageTitle: z.string().optional(),
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


const pageBacklinksConfigSchema = z.object({
	/**
	 * Whether the backlinks component should be visible for this page, has precedence over global rules
	 */
	visible: z.boolean().optional(),
});
export type PageBacklinksConfig = z.infer<typeof pageBacklinksConfigSchema>;


export const pageSiteGraphSchema = z.object({
	/**
	 * The title of the page
	 *
	 * @required
	 */
	title: z.string().optional(),
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
	sitemap: pageSitemapConfigSchema.optional().default({
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
	/**
	 * Configuration for the backlinks component for this page
	 *
	 * Overrides global backlinks configuration
	 *
	 * @optional
	 */
	backlinks: pageBacklinksConfigSchema.optional(),
});
export type PageSiteGraphFrontmatter = z.infer<typeof pageSiteGraphSchema>;
