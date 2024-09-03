import { AstroError } from 'astro/errors';
import { z } from 'astro/zod';

export type GraphConfig = z.infer<typeof graphConfigSchema>;
export type SitemapConfig = z.infer<typeof globalSitemapConfigSchema>;

const easing_types = z.union([
	z.literal('in_quad'),
	z.literal('out_quad'),
	z.literal('in_out_quad'),
	z.literal('linear'),
]);

const node_color_types = z.union([
	z.literal('nodeColor'),
	z.literal('nodeColorVisited'),
	z.literal('nodeColorCurrent'),
	z.literal('nodeColorUnresolved'),
	z.literal('nodeColorTag'),

	z.literal('nodeColor1'),
	z.literal('nodeColor2'),
	z.literal('nodeColor3'),
	z.literal('nodeColor4'),
	z.literal('nodeColor5'),
	z.literal('nodeColor6'),
	z.literal('nodeColor7'),
	z.literal('nodeColor8'),
	z.literal('nodeColor9'),
	z.literal('linkColor'),
]);

const node_shape_styles = z.union([
	z.literal('circle'),
	z.literal('circle-hollow')
]);

const tagStyle = z.object({
	/**
	 * Default size of the tag nodes in the graph, overridden by `tagStyles`
	 *
	 * @default 6
	 */
	shapeSize: z.number().default(6),
	/**
	 * Default stroke width of the tag nodes in the graph, overridden by `tagStyles`
	 *
	 * @default 0
	 */
	strokeWidth: z.number().default(1),
	/**
	 * Default size of the tag nodes in the graph, overridden by `tagStyles`
	 *
	 * @default 10
	 */
	color: node_color_types.default('nodeColorTag'),
	/**
	 * Default shape of the tag nodes in the graph, overridden by `tagStyles`
	 * - `circle`: Circular shape
	 * - `circle-hollow`: Circular shape with no fill
	 *
	 * @default "circle"
	 */
	shape: node_shape_styles.default('circle-hollow'),
});

export type NodeStyle = z.infer<typeof tagStyle>;

export const graphConfigSchema = z.object({
	/**
	 * The actions available within the graph component
	 *
	 * - `fullscreen`: Toggle fullscreen mode
	 * - `depth`: Increase the depth of the graph
	 * - `reset-zoom`: Reset the zoom level and center the graph on node of current page
	 * - `render-arrows`: Toggle the rendering of arrows
	 * - `settings`: Open the simulation settings modal
	 *
	 * @default ["fullscreen", "depth", "reset-zoom", "render-arrows", "settings"]
	 */
	actions: z
		.array(
			z.union([
				z.literal('fullscreen'),
				z.literal('depth'),
				z.literal('reset-zoom'),
				z.literal('render-arrows'),
				z.literal('settings'),
			]),
		)
		.default(['fullscreen', 'depth', 'reset-zoom', 'render-arrows', 'settings']),
	/**
	 * Whether to track pages that were visited in the sidebar graph component.
	 *
	 * @default true
	 */
	trackVisitedPages: z.boolean().default(true),
	/**
	 * The mode of interaction to trigger the page navigation
	 *
	 * - `auto`: Require double click for mobile devices with touch input, single click otherwise
	 * - `click`: Always require a single click
	 * - `dblclick`: Always require a double click
	 *
	 * @default "auto"
	 */
	clickMode: z.union([z.literal('auto'), z.literal('click'), z.literal('dblclick')]).default('auto'),

	/**
	 * Define shape, color and size, and stroke of specified tags
	 *
	 * @default { }
	 * @example The "index" tag is visualized a circle of size 12, with no stroke
	 * { "index": { color: "nodeColor1", shape: "circle", shapeSize: 12, strokeWidth: 0 } }
	 */
	tagStyles: z.record(z.string().transform((val) => !val.startsWith("#") ? "#" + val : val), tagStyle.partial()).default({}),
	/**
	 * Default style of tag nodes in the graph
	 *
	 * @default { color: "nodeColorTag", shape: "circle-hollow", shapeSize: 6, strokeWidth: 1 }
	 */
	tagDefaultStyle: tagStyle.default({}),
	/**
	 * How tags should be rendered in the graph
	 * - `none`: Tags are not rendered at all
	 * - `node`: Tags are rendered as separate nodes (connected to all nodes that contain the tag)
	 * - `color`: Nodes with tag are colored based on the specified tag color
	 * - `both`: Tags are rendered as separate nodes and nodes colored based on the associated tag color
	 *
	 * @default "none"
	 */
	tagRenderMode: z.union([z.literal('none'), z.literal('node'), z.literal('color'), z.literal('both')]).default('none'),

	/**
	 * Whether to enable user dragging/panning of the graph
	 *
	 * @default true
	 */
	enableDrag: z.boolean().default(true),
	/**
	 * Whether to enable user zooming of the graph
	 *
	 * @default true
	 */
	enableZoom: z.boolean().default(true),
	/**
	 * Whether to enable hover interactions on the graph
	 * This includes highlighting nodes and links on hover, and showing labels
	 *
	 * @default true
	 */
	enableHover: z.boolean().default(true),
	/**
	 * The depth of the graph, determines how many levels of links are shown
	 *
	 * @default 1
	 */
	depth: z.number().default(1),
	/**
	 * The scale of the graph, determines the zoom level
	 *
	 * @default 1.1
	 */
	scale: z.number().default(1.1),
	/**
	 * The minimum zoom level of the graph
	 *
	 * @default 0.05
	 */
	minZoom: z.number().default(0.05),
	/**
	 * The maximum zoom level of the graph
	 *
	 * @default 4
	 */
	maxZoom: z.number().default(4),

	/**
	 * Whether to render page title labels on the nodes
	 *
	 * @default true
	 */
	renderLabels: z.boolean().default(true),
	/**
	 * Whether to render arrows on the links
	 *
	 * @default true
	 */
	renderArrows: z.boolean().default(false),
	/**
	 * Whether to render unresolved pages in the graph
	 *
	 * @default false
	 */
	renderUnresolved: z.boolean().default(false),

	/**
	 * Whether to scale the links based on the zoom level
	 *
	 * @default true
	 */
	scaleLinks: z.boolean().default(true),
	/**
	 * Whether to scale the arrows based on the zoom level
	 *
	 * @default false
	 */
	scaleArrows: z.boolean().default(true),

	/**
	 * The scale factor for the opacity of the labels, based on the zoom level
	 * A higher value will make the labels more opaque at lower zoom levels
	 *
	 * @default 1.3
	 */
	labelOpacityScale: z.number().default(1.3),
	/**
	 * The opacity of unhovered labels (when hovering over a node)
	 *
	 * @default 0
	 */
	labelBlurOpacity: z.number().default(0),
	/**
	 * The opacity of the label when hovering over a node
	 *
	 * @default 1
	 */
	labelHoverOpacity: z.number().default(1),
	/**
	 * The font size of the labels
	 *
	 * @default 12
	 */
	labelFontSize: z.number().default(12),
	/**
	 * The offset of the labels from the nodes
	 *
	 * @default 10
	 */
	labelOffset: z.number().default(10),
	/**
	 * The offset of the label from the node when hovering over said node
	 *
	 * @default 14
	 */
	labelHoverOffset: z.number().default(14),

	/**
	 * The duration of the zoom animation in milliseconds
	 * This controls the speed of zooming and panning
	 *
	 * @default 75
	 */
	zoomDuration: z.number().default(75),
	/**
	 * The easing function for the zoom animation
	 * This controls the acceleration of zooming and panning
	 *
	 * @default "out_quad"
	 */
	zoomEase: easing_types.default('out_quad'),
	/**
	 * The duration of the hover animation in milliseconds
	 * This controls the speed of the node/link/label highlighting transitions
	 *
	 * @default 200
	 */
	hoverDuration: z.number().default(200),
	/**
	 * The easing function for the hover animation
	 * This controls the acceleration of the node/link/label highlighting transitions
	 *
	 * @default "out_quad"
	 */
	hoverEase: easing_types.default('out_quad'),

	/**
	 * The size of the nodes in the graph
	 *
	 * @default 10
	 */
	nodeSize: z.number().default(10),
	/**
	 * The scale factor for the size of the nodes based on the number of incoming and outgoing links
	 *
	 * @default 0.2
	 */
	nodeSizeLinkScale: z.number().default(0.2),

	/**
	 * The width of the links in the graph
	 *
	 * @default 1
	 */
	linkWidth: z.number().default(1),

	/**
	 * The size of the arrows on the links
	 *
	 * @default 6
	 */
	arrowSize: z.number().default(6),
	/**
	 * The angle of the arrowhead of the links, a smaller angle will make the arrowhead pointier
	 *
	 * @default Math.PI / 6
	 */
	arrowAngle: z.number().default(Math.PI / 6),

	/**
	 * The strength of the force that pulls nodes towards the center of the graph
	 * A higher value will bring nodes closer together
	 *
	 * @default 0.05
	 */
	nodeForce: z.number().default(0.05),
	/**
	 * The collision force between nodes in the graph
	 * A higher value will make nodes repel each other more strongly, creating an even, grid-like layout
	 *
	 * @default 20
	 */
	collisionForce: z.number().default(20),
	/**
	 * The attraction/repulsion force between nodes in the graph
	 * A higher value will increase the distance between nodes
	 *
	 * @default 200
	 */
	repelForce: z.number().default(200),
	/**
	 * The force that pulls nodes towards the center of gravity of the graph
	 *
	 * @default 0
	 */
	centerForce: z.number().default(0),
	/**
	 * The distance between linked nodes in the graph
	 * If set to 0, link distance are determined by the force simulation
	 *
	 * @default 0
	 */
	linkDistance: z.number().default(0),
});

const globalGraphConfigSchema = graphConfigSchema.extend({
	/**
	 * Configure the visibility of the graph component in the sidebar with an ordered list of rules.
	 * The graph is hidden/shown if the page's _slug_ matches one of the rules.
	 * When a rule starts with `!`, the graph is _hidden_ if matched.
	 * Rules are evaluated in order, the first matching rule determines the visibility of the page.
	 * If visibility of the graph was specified in the page frontmatter, it will take precedence over these rules.
	 *
	 * @default Graph is visible for all pages
	 * ["**\/*"]
	 * @example Only show graph for pages in the "api" folder:
	 * ["api/**"]
	 * @example Show graph for all pages except those in the "secret" folder:
	 * ["!secret/**", "**\/*"]
	 * @see https://github.com/mrmlnc/fast-glob#basic-syntax
	 */
	visibilityRules: z.array(z.string()).default(['**/*']),

	/**
	 * Whether to track pages that were visited in the sidebar graph component.
	 */
	trackVisitedPages: z.boolean().default(true),
});

const globalBacklinksConfigSchema = z.object({
	/**
	 * Configure the visibility of the backlinks component in the sidebar with an ordered list of rules.
	 * The backlinks are hidden/shown if the page's _slug_ matches one of the rules.
	 * When a rule starts with `!`, the backlinks are _hidden_ if matched.
	 * Rules are evaluated in order, the first matching rule determines the visibility of the page.
	 * If visibility of the backlinks was specified in the page frontmatter, it will take precedence over these rules.
	 *
	 * @default Backlinks are visible for all pages
	 * ["**\/*"]
	 * @example Only show backlinks for pages in the "api" folder:
	 * ["api/**"]
	 * @example Show backlinks for all pages except those in the "secret" folder:
	 * ["!secret/**", "**\/*"]
	 * @see https://github.com/mrmlnc/fast-glob#basic-syntax
	 */
	visibilityRules: z.array(z.string()).default(['**/*']),
});

const globalSitemapConfigSchema = z.object({
	/**
	 * The root directory of the content used to generate links from for the sitemap
	 *
	 * @default "./src/content/docs"
	 */
	contentRoot: z.string().default('./src/content/docs'),

	/**
	 * Specify a custom sitemap to be used for the PageSidebar graph component.
	 * If unspecified, a sitemap will be generated from the content directory (see `contentRoot`), using the `pageInclusionRules` and `linkInclusionRules`.
	 *
	 * @default undefined
	 */
	sitemap: z
		.record(
			z.string(),
			z.object({
				exists: z.boolean().default(true),
				title: z.string(),
				links: z.array(z.string()),
				backlinks: z.array(z.string()),
				tags: z.array(z.string()),
			}),
		)
		.optional(),

	/**
	 * Determine the inclusion of files in the sitemap based on provided ordered list of rules.
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
	pageInclusionRules: z.array(z.string()).default(['**/*']),

	/**
	 * Determine which links are included in the sitemap for every page.
	 * The link is included/excluded if the link's target _path_ matches one of the rules.
	 * When a rule starts with `!`, the link is _excluded_ if matched.
	 * Rules are evaluated in order, the first matching rule determines the inclusion of the link.
	 * Link rules specified in the page frontmatter take precedence over these rules.
	 *
	 * @default Sitemap includes all links by default
	 * ["**\/*"]
	 * @example Only include links to endpoints in the "api" subdirectory:
	 * ["api/**"]
	 * @example Include all links except those to the "secret" subdirectory:
	 * ["!secret/**", "**\/*"]
	 */
	linkInclusionRules: z.array(z.string()).default(['**/*']),

	/**
	 * Determine which pages should be associated with specific tags based on provided ordered list of rules. \
	 * A tag is added to the page if the file's _path_ matches one of the rules. \
	 * When a rule starts with `!`, if matched, it will _remove_ the tag from the page _(not from the file!)_, if it exists. \
	 * Rules are evaluated in order, the first matching rule determines whether the tag is added. \
	 * Tags generated from the rules will be combined with tags specified in the page frontmatter.
	 *
	 * @default {}
	 * @example Add the "api" tag to all pages in the "api" folder:
	 * { "api": ["api/**"] }
	 * @example Add the "secret" tag to all pages except those in the "public" folder, will remove existing "secret" tags in the "public" folder:
	 * { "secret": ["!public/**", "**\/*"] }
	 */
	tagRules: z.record(z.string(), z.array(z.string())).default({}),
});

export const starlightSiteGraphConfigSchema = z
	.object({
		/**
		 * The prefix used for the key which stores the visited pages in the browser's storage.
		 *
		 * @default "graph-"
		 */
		storageKey: z.string().default('graph-'),
		/**
		 * The specific location in the browser where the visited pages are stored.
		 *
		 * @default "session"
		 */
		storageLocation: z.union([z.literal('none'), z.literal('session'), z.literal('local')]).default('session'),

		/**
		 * Configuration for the PageSidebar graph component.
		 *
		 * @default ```{
		 *     visibilityRules: ["**\/*"],
		 *     trackVisitedPages: true,
		 *
		 *     actions: ['fullscreen', 'depth', 'reset-zoom', 'render-arrows', 'settings'],
		 *     clickMode: 'auto',
		 *
		 *     tagStyles: {},
		 *     tagRenderMode: 'none',
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
		 *     labelBlurOpacity: 0,
		 *     labelHoverOpacity: 1,
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
		 * }```
		 */
		graphConfig: globalGraphConfigSchema.default({}),

		/**
		 * Configuration for the sitemap generation.
		 *
		 * @default ```{
		 *    contentRoot: './src/content/docs',
		 *    pageInclusionRules: ["**\/*"],
		 *    linkInclusionRules: ["**\/*"],
		 * }```
		 */
		sitemapConfig: globalSitemapConfigSchema.default({}),

		/**
		 * Configuration for the PageSidebar backlinks component.
		 *
		 * @default ```{
		 *   visibilityRules: ["**\/*"],
		 * }```
		 */
		backlinksConfig: globalBacklinksConfigSchema.default({}),
	})
	.default({});

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
