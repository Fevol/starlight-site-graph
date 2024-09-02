import { AstroError } from 'astro/errors';
import { z } from 'astro/zod';

type GraphActionTypes = 'fullscreen' | 'depth' | 'reset-zoom' | 'render-arrows' | 'settings';
type EaseTypes = 'in_quad' | 'out_quad' | 'in_out_quad' | 'linear';

export const defaultGraphConfig: GraphConfig = {
	actions: ['fullscreen', 'depth', 'reset-zoom', 'render-arrows', 'settings'],
	trackVisitedPages: true,
	clickMode: 'auto',

	enableDrag: true,
	enableZoom: true,
	enableHover: true,
	depth: 1,
	scale: 1.1,
	minZoom: 0.05,
	maxZoom: 4,

	renderLabels: true,
	renderArrows: false,
	renderUnresolved: false,

	scaleLinks: true,
	scaleArrows: true,

	labelOpacityScale: 1.3,
	labelFontSize: 12,
	labelOffset: 10,
	labelHoverOffset: 14,

	zoomDuration: 75,
	zoomEase: 'out_quad',
	hoverDuration: 200,
	hoverEase: 'out_quad',

	nodeSize: 10,
	nodeSizeLinkScale: 0.2,

	linkWidth: 1,

	arrowSize: 6,
	arrowAngle: Math.PI / 6,

	nodeForce: 0.05,
	repelForce: 200,
	centerForce: 0,
	linkDistance: 30,
	collisionForce: 20,

	showTags: false,
	removeTags: [],
	customFolderTags: {},
};

export type GraphConfig = {
	actions: GraphActionTypes[];
	trackVisitedPages: boolean;
	clickMode: 'auto' | 'click' | 'dblclick';

	enableDrag: boolean;
	enableZoom: boolean;
	enableHover: boolean;
	depth: number;
	scale: number;
	minZoom: number;
	maxZoom: number;

	renderLabels: boolean;
	renderArrows: boolean;
	renderUnresolved: boolean;

	scaleLinks: boolean;
	scaleArrows: boolean;

	labelOpacityScale: number;
	labelFontSize: number;
	labelOffset: number;
	labelHoverOffset: number;

	zoomDuration: number;
	zoomEase: EaseTypes;
	hoverDuration: number;
	hoverEase: EaseTypes;

	nodeSize: number;
	nodeSizeLinkScale: number;

	linkWidth: number;

	arrowSize: number;
	arrowAngle: number;

	collisionForce: number;
	nodeForce: number;
	repelForce: number;
	centerForce: number;
	linkDistance: number;

	customFolderTags: Record<string, string>;
	showTags: boolean;
	removeTags: string[];
};

const easing_types = z.union([
	z.literal('in_quad'),
	z.literal('out_quad'),
	z.literal('in_out_quad'),
	z.literal('linear'),
]);

const action_types = z.union([
	z.literal('fullscreen'),
	z.literal('depth'),
	z.literal('reset-zoom'),
	z.literal('render-arrows'),
	z.literal('settings'),
]);


export const graphConfigSchema = z
	.object({
		actions: z.array(action_types).default(defaultGraphConfig.actions),
		trackVisitedPages: z.boolean().default(defaultGraphConfig.trackVisitedPages),
		clickMode: z.union([z.literal('auto'), z.literal('click'), z.literal('dblclick')]).default(
			defaultGraphConfig.clickMode,
		),

		enableDrag: z.boolean().default(defaultGraphConfig.enableDrag),
		enableZoom: z.boolean().default(defaultGraphConfig.enableZoom),
		enableHover: z.boolean().default(defaultGraphConfig.enableHover),
		depth: z.number().default(defaultGraphConfig.depth),
		scale: z.number().default(defaultGraphConfig.scale),
		minZoom: z.number().default(defaultGraphConfig.minZoom),
		maxZoom: z.number().default(defaultGraphConfig.maxZoom),

		renderLabels: z.boolean().default(defaultGraphConfig.renderLabels),
		renderArrows: z.boolean().default(defaultGraphConfig.renderArrows),
		renderUnresolved: z.boolean().default(defaultGraphConfig.renderUnresolved),

		scaleLinks: z.boolean().default(defaultGraphConfig.scaleLinks),
		scaleArrows: z.boolean().default(defaultGraphConfig.scaleArrows),

		labelOpacityScale: z.number().default(defaultGraphConfig.labelOpacityScale),
		labelFontSize: z.number().default(defaultGraphConfig.labelFontSize),
		labelOffset: z.number().default(defaultGraphConfig.labelOffset),
		labelHoverOffset: z.number().default(defaultGraphConfig.labelHoverOffset),

		zoomDuration: z.number().default(defaultGraphConfig.zoomDuration),
		zoomEase: easing_types.default(defaultGraphConfig.zoomEase),
		hoverDuration: z.number().default(defaultGraphConfig.hoverDuration),
		hoverEase: easing_types.default(defaultGraphConfig.hoverEase),

		nodeSize: z.number().default(defaultGraphConfig.nodeSize),
		nodeSizeLinkScale: z.number().default(defaultGraphConfig.nodeSizeLinkScale),

		linkWidth: z.number().default(defaultGraphConfig.linkWidth),

		arrowSize: z.number().default(defaultGraphConfig.arrowSize),
		arrowAngle: z.number().default(defaultGraphConfig.arrowAngle),

		nodeForce: z.number().default(defaultGraphConfig.nodeForce),
		collisionForce: z.number().default(defaultGraphConfig.collisionForce),
		repelForce: z.number().default(defaultGraphConfig.repelForce),
		centerForce: z.number().default(defaultGraphConfig.centerForce),
		linkDistance: z.number().default(defaultGraphConfig.linkDistance),

		showTags: z.boolean().default(defaultGraphConfig.showTags),
		removeTags: z.array(z.string()).default(defaultGraphConfig.removeTags),
		customFolderTags: z.record(z.string()).default(defaultGraphConfig.customFolderTags),
	})



export const starlightSiteGraphConfigSchema = z
	.object({
		/**
		 * The root directory of the content to generate links from
		 *
		 * @default "docs"
		 */
		contentRoot: z.string().default('./src/content/docs'),
		storageKey: z.string().default('graph-'),
		storageLocation: z.union([z.literal('none'), z.literal('session'), z.literal('local')]).default('session'),

		/**
		 * Configure the visibility of the graph component in the sidebar with an ordered list of rules.
		 * The graph is hidden/shown if the page's _slug_ matches one of the rules.
		 * When a rule starts with `!`, the graph is _hidden_ if matched.
		 * Rules are evaluated in order, the first matching rule determines the visibility of the page.
		 * If visibility of the page was specified in the page frontmatter, it will take precedence over these rules.
		 *
		 * @default Graph is visible for all pages
		 * ["**\/*"]
		 * @example Only show graph for pages in the "api" folder:
		 * ["api/**", "!**\/*"]
		 * @example Show graph for all pages except those in the "secret" folder:
		 * ["!secret/**", "**\/*"]
		 * @see https://github.com/mrmlnc/fast-glob#basic-syntax
		 */
		graphVisibilityRules: z.array(z.string()).default(["**/*"]),
		/**
		 * Configure the inclusion of files in the sitemap with an ordered list of rules.
		 * The page is included/excluded if the file's _path_ matches one of the rules.
		 * When a rule starts with `!`, the file is _excluded_ if matched.
		 * Rules are evaluated in order, the first matching rule determines the inclusion of the file.
		 * If sitemap inclusion was specified in the page frontmatter, it will take precedence over these rules.
		 *
		 * @default Sitemap includes all files by default
		 * ["**\/*"]
		 * @example Only include files in the "api" folder:
		 * ["api/**", "!**\/*"]
		 * @example Include all files except those in the "secret" folder:
		 * ["!secret/**", "**\/*"]
		 */
		sitemapInclusionRules: z.array(z.string()).default(["**/*"]),

		/**
		 * Configure the rules for which links are included in the sitemap per page.
		 * The link is included/excluded if the link's target _path_ matches one of the rules.
		 * When a rule starts with `!`, the link is _excluded_ if matched.
		 * Rules are evaluated in order, the first matching rule determines the inclusion of the link.
		 * If sitemap inclusion was specified in the page frontmatter, it will take precedence over these rules.
		 *
		 * @default Sitemap includes all links by default
		 * ["**\/*"]
		 * @example Only include links to endpoints in the "api" subdirectory:
		 * ["api/**", "!**\/*"]
		 * @example Include all links except those to the "secret" subdirectory:
		 * ["!secret/**", "**\/*"]
		 */
		sitemapLinkRules: z.array(z.string()).default(["**/*"]),

		/**
		 * Configuration for the graph
		 *
		 * @default {
		 * 	   actions: ['fullscreen', 'depth', 'reset-zoom', 'render-arrows', 'settings'],
		 * 	   clickMode: 'auto',
		 *
		 *     enableDrag: true,
		 *     enableZoom: true,
		 *     enableHover: true,
		 *     depth: 1,
		 *     scale: 1.1,
		 *     minZoom: 0.05,
		 *     maxZoom: 4,
		 *
		 *     renderLabels: true,
		 *     renderArrows: true,
		 *     renderUnresolved: false,
		 *
		 *     scaleLinks: true,
		 *     scaleArrows: false,
		 *
		 *     labelOpacityScale: 1.3,
		 *     labelFontSize: 12,
		 *     labelOffset: 10,
		 *     labelHoverOffset: 14,
		 *
		 *     zoomDuration: 75,
		 *     zoomEase: "out_quad",
		 *     hoverDuration: 200,
		 *     hoverEase: "out_quad",
		 *
		 *     nodeSize: 10,
		 *     nodeSizeLinkScale: 0.2,
		 *
		 *     linkWidth: 1,
		 *
		 *     arrowSize: 6,
		 *     arrowAngle: Math.PI / 6,
		 *
		 *     repelForce: 0.5,
		 *     centerForce: 0.3,
		 *     linkDistance: 30,
		 *
		 *     showTags: false,
		 *     removeTags: [],
		 *     customFolderTags: {},
		 * }
		 */
		graphConfig: graphConfigSchema.default(defaultGraphConfig),
		/**
		 * Specify a custom sitemap to be used for the PageSidebar graph, if not provided, a sitemap will be generated from the content directory
		 * including/excluding files based on the `include_sitemap` and `exclude_sitemap` options
		 *
		 * @default undefined
		 */
		sitemap: z
			.record(
				z.string(),
				z.object({
					exists: z.boolean(),
					title: z.string(),
					links: z.array(z.string()),
					backlinks: z.array(z.string()),
					tags: z.array(z.string()),
				}),
			)
			.optional(),
	})
	.default({
		contentRoot: './src/content/docs',
		graphConfig: defaultGraphConfig,
		graphVisibilityRules: ["**/*"],
		sitemapInclusionRules: ["**/*"],
		sitemapLinkRules: ["**/*"],
	});

export type StarlightSiteGraphConfig = z.infer<typeof starlightSiteGraphConfigSchema>;

export function validateConfig(userConfig: unknown): StarlightSiteGraphConfig {
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

	return config.data;
}
