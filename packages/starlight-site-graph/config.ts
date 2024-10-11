import { AstroError } from 'astro/errors';
import { z } from 'astro/zod';

export type GraphConfig = z.infer<typeof graphConfigSchema>;
export type SitemapConfig = z.infer<typeof globalSitemapConfigSchema>;

const easingTypes = z.union([
	z.literal('in_quad'),
	z.literal('out_quad'),
	z.literal('in_out_quad'),
	z.literal('linear'),
]);

const nodeColorTypes = z.union([
	z.literal('backgroundColor'),
	z.literal('nodeColor'),
	z.literal('nodeColorVisited'),
	z.literal('nodeColorCurrent'),
	z.literal('nodeColorUnresolved'),
	z.literal('nodeColorExternal'),
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

const percentageSchema = z.union([z.number().min(0, "Shape corner radius may not be negative"), z.string()
	.refine(val => val.match(/^\d+\.?\d?\d?%?$/), {
		message: 'Invalid percentage format, expected a string in the format "XX%"',
	})
	.refine((s) => parseFloat(s) >= 0 && parseFloat(s) <= 100, {
		message: 'Invalid percentage value, expected a number between 0 and 100',
	})]
)

const nodeShapeTypes = z.union([
	/**
	 * Circular shape
	 */
	z.literal('circle'),
	/**
	 * Square shape \
	 * Defined as `polygon` with `shapePoints` set to 4
	 */
	z.literal('square'),
	/**
	 * Triangle shape \
	 * Defined as `polygon` with `shapePoints` set to 3
	 */
	z.literal('triangle'),
	/**
	 * Regular polygon shape \
	 * Defined by `shapePoints`
	 */
	z.literal('polygon'),
	/**
	 * Regular star 2n-polygon shape \
	 * Defined by `shapePoints`
	 */
	z.literal('star'),
]);
export type NodeShapeType = z.infer<typeof nodeShapeTypes>;

export const nodeStyle = z.object({
	/**
	 * Shape of the node in the graph
	 * - `circle`: Circular shape
	 * - `square`: Square shape
	 * - `triangle`: Triangle shape
	 * - `polygon`: Polygon shape (with `shapePoints` vertices)
	 * - `star`: Star shape (with `shapePoints` spikes)
	 *
	 * @default "circle"
	 */
	shape: nodeShapeTypes.default('circle'),
	/**
	 * Size of the node in the graph, further scaled by `linkScale`
	 *
	 * @default 10
	 */
	shapeSize: z.number().gt(0, "Shape size may not be zero or negative").default(10),
	/**
	 * Color of the node shape in the graph, overridden if the node is visited, current, or unresolved
	 * If set to `'stroke'`, the color will be taken from the stroke color, if it exists, otherwise defaults to `nodeColor`
	 *
	 * @default "nodeColor"
	 */
	shapeColor: nodeColorTypes.or(z.literal('stroke')).default('nodeColor').optional(),
	/**
	 * Number of points for `polygon` or `star` shapes
	 *
	 * @optional
	 */
	shapePoints: z.number().min(2, "The number of points for the shape may not be smaller than 2").optional(),
	/**
	 * Rotation of the polygon or star shape in degrees. \
	 * If set to `'random'`, the shape will be rotated randomly.
	 *
	 * @optional
	 */
	shapeRotation: z.union([z.number(), z.literal('random')]).optional(),
	/**
	 * Radius of the shape (and, if not specified, stroke corners); does not affect circle shapes \
	 * A number will be parsed as the radius of the corner in pts (clamped to `shapeWidth`). \
	 * A string (e.g. `'17.648%'`) will be parsed as the radius of the corner relative to the shape size.
	 *
	 * @remarks High values of `shapeCornerRadius` will result in link connections not being rendered correctly
	 * @optional
	 */
	shapeCornerRadius: percentageSchema.optional(),

	/**
	 * Type of corner for the shape and stroke
	 * - `normal`: Normal corners
	 * - `round`: Rounded corners
	 * - `bevel`: Beveled corners
	 *
	 * @optional
	 */
	cornerType: z.union([z.literal('normal'), z.literal('round'), z.literal('bevel')]).optional(),

	/**
	 * Stroke width of the node in the graph
	 *
	 * @default 0
	 */
	strokeWidth: z.number().min(0).default(0),
	/**
	 * Stroke color of the node in the graph
	 * If none is specified, the stroke color will be the same as the shape color
	 *
	 * @optional
	 */
	strokeColor: nodeColorTypes.or(z.literal('inherit')).optional(),
	/**
	 * Radius of the stroke corners; does not affect circle shapes \
	 * A number will be parsed as the radius of the corner in pts (clamped to `shapeWidth`). \
	 * A string (e.g. `'17.648%'`) will be parsed as the radius of the corner relative to the shape size.
	 *
	 * @remarks High values of `shapeCornerRadius` will result in link connections not being rendered correctly
	 * @optional
	 */
	strokeCornerRadius: percentageSchema.optional(),

	/**
	 * Scale of the shape collider user for collision forces
	 * A value higher than 1 will make the collider larger than the shape
	 *
	 * @default 1
	 */
	colliderScale: z.number().min(0).default(1),
	/**
	 * Scale factor for the node size.
	 *
	 * @default 1
	 */
	nodeScale: z.number().min(0).default(1),
	/**
	 * Scale strength of the node based on the number of neighbors (incoming and outgoing links). \
	 * When set to 0, the node size will not be affected by the number of neighbors.
	 *
	 * @default 0.5
	 */
	neighborScale: z.number().min(0).default(0.5),
});

export type NodeStyle = z.infer<typeof nodeStyle>;

const sitemapEntrySchema = z.object({
	/**
	 * Whether the page is external (i.e. not part of the website)
	 * @remarks Used for links to other websites
	 */
	external: z.boolean(),
	/**
	 * Whether the page exists
	 * @remarks Used for unresolved pages
	 */
	exists: z.boolean(),
	/**
	 * The title of the page
	 */
	title: z.string(),
	/**
	 * The links going out from the page
	 *
	 * @optional
	 */
	links: z.array(z.string()).optional(),
	/**
	 * The backlinks going into the page
	 *
	 * @optional
	 */
	backlinks: z.array(z.string()).optional(),
	/**
	 * The tags associated with the page
	 *
	 * @optional
	 */
	tags: z.array(z.string()).optional(),
	/**
	 * The style of the node in the graph
	 */
	nodeStyle: nodeStyle.partial().optional(),
});

export type SitemapEntry = z.infer<typeof sitemapEntrySchema>;

const sitemapSchema = z.record(z.string(), sitemapEntrySchema);

export type Sitemap = z.infer<typeof sitemapSchema>;

export const graphConfigSchema = z.object({
	/**
	 * The actions available within the graph component
	 *
	 * - `fullscreen`: Toggle fullscreen mode
	 * - `depth`: Increase the depth of the graph
	 * - `reset-zoom`: Reset the zoom level and center the graph on node of current page
	 * - `render-arrows`: Toggle the rendering of arrows
	 * - `render-external`: Toggle the rendering of nodes representing external pages
	 * - `render-unresolved`: Toggle the rendering of nodes representing unresolved pages
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
				z.literal('render-external'),
				z.literal('render-unresolved'),
				z.literal('settings')
			]),
		)
		.default(['fullscreen', 'depth', 'reset-zoom', 'render-arrows', 'settings']),

	/**
	 * Define shape, color and size, and stroke of specified tags
	 *
	 * @default { }
	 * @example The "index" tag is visualized a circle of size 12, with no stroke
	 * { "index": { shapeColor: "nodeColor1", shape: "circle", shapeSize: 12, strokeWidth: 0 } }
	 */
	tagStyles: z
		.record(
			z.string().transform(val => (!val.startsWith('#') ? '#' + val : val)),
			nodeStyle.partial(),
		)
		.default({}),
	/**
	 * How tags should be rendered in the graph
	 * - `none`: Tags are not rendered at all
	 * - `node`: Tags are rendered as separate nodes (connected to all nodes that contain the tag) \
	 *           The style of the tag is determined by the associated tag style in `tagStyles` (or `tagDefaultStyle` if none was specified)
	 * - `same`: Nodes assume the style of the associated tag(s) defined in `tagStyles` \
	 *           If multiple tags with different styles are attached to the node, the first defined style for each tag is used
	 * - `both`: Tags are rendered as separate nodes and nodes assume the style of the associated tag(s) defined in `tagStyles`
	 *
	 * @default "none"
	 */
	tagRenderMode: z
		.union([z.literal('none'), z.literal('node'), z.literal('same'), z.literal('both')])
		.default('none'),

	/**
	 * Whether to enable user dragging of nodes in the graph
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
	 * Whether to enable user panning of the graph (i.e. moving left/right/up/down)
	 */
	enablePan: z.boolean().default(true),
	/**
	 * Whether to enable hover interactions on the graph
	 * This includes highlighting nodes and links on hover, and showing labels
	 *
	 * @default true
	 */
	enableHover: z.boolean().default(true),
	/**
	 * The mode of interaction to trigger the page navigation
	 *
	 * - `auto`: Require double click for mobile devices with touch input, single click otherwise
	 * - `disable`: Disable all interactions
	 * - `click`: Always require a single click
	 * - `dblclick`: Always require a double click
	 *
	 * @default "auto"
	 */
	enableClick: z
		.union([z.literal('auto'), z.literal('disable'), z.literal('click'), z.literal('dblclick')])
		.default('auto'),

	/**
	 * The depth of the graph, determines how many levels of links are shown. \
	 * - `-x`: Show the entire graph (the particular value does not matter)
	 * - `0`: Only the current page is shown
	 * - `1`: The current page and its direct neighbors are shown
	 * - `x`: The current page and its neighbors up to `depth` levels are shown
	 *
	 * The graph will be traversed with the `depthDirection` option.
	 *
	 * @remarks For performance reasons, the depth is capped at `6`.
	 * @default 1
	 */
	depth: z.number().default(1),
	/**
	 * In which direction the depth of the graph should be expanded
	 * - `both`: Expand in both incoming and outgoing directions
	 * - `incoming`: Expand only in the incoming direction
	 * - `outgoing`: Expand only in the outgoing direction
	 *
	 * @default "both"
	 */
	depthDirection: z.union([z.literal('both'), z.literal('incoming'), z.literal('outgoing')]).default('both'),

	/**
	 * Determine what should happen when a link is followed
	 * - `same`: Open the link in the same tab
	 * - `new-tab`: Open the link in a new tab
	 * - `graph`: Set the link as the current node in the graph
	 *
	 * @remark This does _not_ apply to external links, which will always open in a new tab
	 * @default "tab"
	 */
	followLink: z.union([z.literal('same'), z.literal('new-tab'), z.literal('graph')]).default('same'),


	/**
	 * The scale of the graph, determines the zoom level
	 *
	 * @default 1.1
	 */
	scale: z.number().gt(0, "Graph scale may not be zero or negative").default(1.1),
	/**
	 * The minimum zoom level of the graph
	 *
	 * @default 0.05
	 */
	minZoom: z.number().gt(0, "Graph zoom may not be zero or negative").default(0.05),
	/**
	 * The maximum zoom level of the graph
	 *
	 * @default 4
	 */
	maxZoom: z.number().gt(0, "Graph zoom may not be zero or negative").default(4),

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
	 * Whether to render external pages in the graph
	 *
	 * @remarks External nodes only exist in the sitemap if `includeExternalLinks` of `sitemapConfig` is set to `true`.
	 * @default true
	 */
	renderExternal: z.boolean().default(true),

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
	 * Minimum zoom level at which the arrows are rendered \
	 * When 0, arrows will always be rendered
	 *
	 * @default 0.8
	 */
	minZoomArrows: z.number().min(0, "Minimum zoom for arrow rendering may not be negative").default(0.8),

	/**
	 * The scale factor for the opacity of the labels, based on the zoom level
	 * A higher value will make the labels more opaque at lower zoom levels
	 *
	 * @default 1.3
	 */
	labelOpacityScale: z.number().min(0, "Opacity scale for labels may not be negative").default(1.3),
	/**
	 * The opacity of unhovered labels (when hovering over a node)
	 *
	 * @default 0
	 */
	labelMutedOpacity: z.number().min(0, "Opacity scale for muted labels may not be negative").default(0),
	/**
	 * The opacity of the label when hovering over a node
	 *
	 * @default 1
	 */
	labelHoverOpacity: z.number().min(0, "Opacity scale for hovered labels may not be negative").default(1),
	/**
	 * The opacity of the label when adjacent to the hovered node. \
	 * If explicitly set to undefined, the `labelMutedOpacity` will be used.
	 */
	labelAdjacentOpacity: z.number().min(0, "Opacity scale for hovered labels may not be negative").optional().default(1),
	/**
	 * The font size of the labels
	 *
	 * @remarks Labels should be disabled using the `renderLabels` option
	 * @default 12
	 */
	labelFontSize: z.number().min(0, "Label font size may not be negative").default(12),
	/**
	 * The scale of the label when hovering over a node
	 *
	 * @default 1
	 */
	labelHoverScale: z.number().min(0, "Label hover scale may not be negative").default(1),
	/**
	 * The offset of the labels from the nodes
	 *
	 * @default 10
	 */
	labelOffset: z.number().min(0, "Label offset may not be negative").default(10),
	/**
	 * The offset of the label from the node when hovering over said node
	 *
	 * @default 14
	 */
	labelHoverOffset: z.number().min(0, "Label hover offset may not be negative").default(14),

	/**
	 * The duration of the zoom animation in milliseconds \
	 * This controls the speed of zooming and panning
	 *
	 * @default 75
	 */
	zoomDuration: z.number().min(0, "Zoom duration may not be negative").default(75),
	/**
	 * The easing function for the zoom animation
	 * This controls the acceleration of zooming and panning
	 *
	 * @default "out_quad"
	 */
	zoomEase: easingTypes.default('out_quad'),
	/**
	 * The duration of the hover animation in milliseconds
	 * This controls the speed of the node/link/label highlighting transitions
	 *
	 * @default 200
	 */
	hoverDuration: z.number().min(0, "Hover duration may not be negative").default(200),
	/**
	 * The easing function for the hover animation
	 * This controls the acceleration of the node/link/label highlighting transitions
	 *
	 * @default "out_quad"
	 */
	hoverEase: easingTypes.default('out_quad'),

	/**
	 * The default style of a node in the graph. \
	 * All other styles will overwrite these values.
	 *
	 * @default ```{
	 * 	   shape: "circle",
	 * 	   shapeColor: "nodeColor",
	 * 	   shapeSize: 10,
	 * 	   strokeWidth: 0,
	 * 	   colliderScale: 1,
	 * 	   nodeScale: 1,
	 * 	   neighborScale: 0.5
	 * 	}```
	 */
	nodeDefaultStyle: nodeStyle
		.optional()
		.transform(val => ({
			shape: 'circle',
			shapeColor: 'nodeColor',
			shapeSize: 10,
			strokeWidth: 0,
			colliderScale: 1,
			nodeScale: 1,
			neighborScale: 0.5,
			...val,
		})),
	/**
	 * The style of node representing a visited page in the graph. \
	 * This style overwrites styles defined in `nodeDefaultStyle`.
	 *
	 * @default { shapeColor: "nodeColorVisited" }
	 */
	nodeVisitedStyle: nodeStyle
		.partial()
		.optional()
		.transform(val => ({
			shapeColor: 'nodeColorVisited',
			...val,
		})),
	/**
	 * The style of node representing the current page in the graph. \
	 * This style overwrites styles defined in `nodeDefaultStyle` and matching `tagStyles`.
	 *
	 * @default { shapeColor: "nodeColorCurrent" }
	 */
	nodeCurrentStyle: nodeStyle
		.partial()
		.optional()
		.transform(val => ({
			shapeColor: 'nodeColorCurrent',
			...val,
		})),
	/**
	 * The style of node representing an unresolved page in the graph. \
	 * This style overwrites styles defined in `nodeDefaultStyle`, matching `tagStyles`, and `nodeCurrentStyle`.
	 *
	 * @default { shapeColor: "nodeColorUnresolved" }
	 */
	nodeUnresolvedStyle: nodeStyle
		.partial()
		.optional()
		.transform(val => ({
			shapeColor: 'nodeColorUnresolved',
			...val,
		})),
	/**
	 * The style of node representing an external page in the graph. \
	 * This style overwrites styles defined in `nodeDefaultStyle`, matching `tagStyles`, and `nodeCurrentStyle`.
	 * External nodes only exist in the sitemap if `includeExternalLinks` of `sitemapConfig` is set to `true`.
	 *
	 * @default { shape: "square", shapeColor: "nodeColorExternal", strokeColor: "inherit", nodeScale: 0.8 }
	 */
	nodeExternalStyle: nodeStyle
		.partial()
		.optional()
		.transform(val => ({
			shape: 'square',
			shapeColor: 'nodeColorExternal',
			strokeColor: 'inherit',
			nodeScale: 0.6,
			...val,
		})),
	/**
	 * Default style of tag nodes in the graph
	 *
	 * @default { shape: 'circle', shapeSize: 6, shapeColor: 'backgroundColor', strokeColor: "nodeColorTag", strokeWidth: 1, colliderScale: 1, nodeScale: 1, neighborScale: 0.7 }
	 */
	tagDefaultStyle: nodeStyle
		.partial()
		.optional()
		.transform(val => ({
			shape: 'circle',
			shapeSize: 6,
			shapeColor: 'backgroundColor',
			strokeColor: 'nodeColorTag',
			strokeWidth: 1,
			colliderScale: 1,
			nodeScale: 1,
			neighborScale: 0.7,
			...val,
		})),

	/**
	 * The width of the links in the graph
	 *
	 * @default 1
	 */
	linkWidth: z.number().min(0, "Link width may not be negative").default(1),
	/**
	 * The width of the hovered links in the graph
	 *
	 * @default 1
	 */
	linkHoverWidth: z.number().min(0, "Hover link width may not be negative").default(1),

	/**
	 * The size of the arrows on the links
	 *
	 * @default 5
	 */
	arrowSize: z.number().min(0, "Arrow size may not be negative").default(5),
	/**
	 * The angle of the arrowhead of the links, a smaller angle will make the arrowhead pointier
	 *
	 * @default Math.PI / 6
	 */
	arrowAngle: z.number().min(0, "Arrow angle may not be negative").default(Math.PI / 6),

	/**
	 * The strength of the force that pulls nodes towards the center of the graph
	 * A higher value will bring nodes closer together
	 *
	 * @default 0.05
	 */
	centerForce: z.number().min(0, "Center force may not be negative").default(0.05),
	/**
	 * The collision force between nodes in the graph
	 * A higher value will make nodes repel each other more strongly, creating an even, grid-like layout
	 *
	 * @default 20
	 */
	colliderPadding: z.number().min(0, "Collider padding may not be negative").default(20),
	/**
	 * The attraction/repulsion force between nodes in the graph
	 * A higher value will increase the distance between nodes
	 *
	 * @default 200
	 */
	repelForce: z.number().min(0, "Repel force may not be negative").default(200),
	/**
	 * The distance between linked nodes in the graph
	 * If set to 0, link distance are determined by the force simulation
	 *
	 * @default 0
	 */
	linkDistance: z.number().min(0, "Link distance may not be negative").default(0),
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
	 * Whether to prefetch pages on hover in the sidebar graph component.
	 *
	 * @default true
	 */
	prefetchPages: z.boolean().default(true),
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
	 * Include links going to external websites in the sitemap
	 *
	 * @default false
	 */
	includeExternalLinks: z.boolean().default(false),

	/**
	 * Specify a custom sitemap to be used for the PageSidebar graph component.
	 * If unspecified, a sitemap will be generated from the content directory (see `contentRoot`), using the `pageInclusionRules` and `linkInclusionRules`.
	 *
	 * @default undefined
	 */
	sitemap: sitemapSchema.optional(),

	/**
	 * Title of nodes for specific nodes of the graph (including external nodes).
	 * **Overrides** the title of the page specified in the frontmatter.
	 * The specified link should match the full path of the page or external link.
	 *
	 * @example The node with endpoint "BASEPATH/intro" should be called "Main" (instead of its frontmatter title "Introduction")
	 * { "BASEPATH/intro": "Main" }
	 */
	pageTitles: z.record(z.string(), z.string()).default({}),


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
	 * @example Remove external links to GitHub for "Edit page":
	 * ["!https://**\/edit/**", "**\/*"]
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

	/**
	 * Specify styles to be applied to pages based on provided ordered list of rules. \
	 * The style is applied to the page if the file's _path_ matches one of the rules. \
	 * When a rule starts with `!`, the style will not be applied if matched. \
	 * Styles generated from these rules take precedence over all styles except those specified in the page frontmatter.
	 *
	 * @remarks `tagStyles` in conjunction with `tagRules` will accomplish the same thing.
	 *
	 * @default {}
	 * @example Make all nodes in the "api" folder take the color of `nodeColor5` (lime)
	 * [{ rules: ["api/**"], shapeColor: "nodeColor5" }]
	 * @example Make the shape of all nodes except those in the "public" folder doubly as large and hollow
	 * [{ rules: ["!public/**", "**\/*"], nodeScale: 2, strokeWidth: "2", shapeColor: "backgroundColor" } ]
	 */
	styleRules: z.map(z.array(z.string()), nodeStyle.partial()).default(new Map()),
});

export const starlightSiteGraphConfigSchema = z
	.object({
		/**
		 * Whether debug mode is enabled
		 * - Adds a frametime counter to the graph
		 */
		debug: z.boolean().default(false),

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
		 * Whether to track pages of the website that were visited by the user.
		 * If disabled, the graph will not show visited pages in a different style (defined by `nodeVisitedStyle`). \
		 * Storage location and key can be configured in the `storageLocation` and `storageKey` options.
		 *
		 * @default true
		 */
		trackVisitedPages: z.boolean().default(true),

		/**
		 * Configuration for the PageSidebar graph component.
		 *
		 * @default ```{
		 *     visibilityRules: ["**\/*"],
		 *     prefetchPages: true,
		 *
		 *     actions: ['fullscreen', 'depth', 'reset-zoom', 'render-arrows', 'settings'],
		 *
		 *     tagStyles: {},
		 *     tagRenderMode: 'none',
		 *
		 *     enableDrag: true,
		 *     enableZoom: true,
		 *     enableHover: true,
		 *     enableClick: 'auto',
		 *     depth: 1,
		 *     depthDirection: 'both',
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
		 *     minZoomArrows: 0.5,
		 *
		 *     labelOpacityScale: 1.3,
		 *     labelMutedOpacity: 0,
		 *     labelHoverOpacity: 1,
		 *     labelFontSize: 12,
		 *     labelOffset: 10,
		 *     labelHoverOffset: 14,
		 *     labelScaleHover: 1,
		 *
		 *     zoomDuration: 75,
		 *     zoomEase: "out_quad",
		 *     hoverDuration: 200,
		 *     hoverEase: "out_quad",
		 *
		 *	   nodeDefaultStyle: {
		 * 	  	 shape: "circle",
		 *	  	 shapeColor: "nodeColor",
		 *	  	 shapeSize: 6,
		 *	  	 strokeWidth: 0,
		 *	  	 colliderScale: 1,
		 *	  	 nodeScale: 1,
		 *	  	 neighborScale: 0.5
		 *	   },
		 *	   nodeVisitedStyle: { shapeColor: "nodeColorVisited" },
		 *	   nodeCurrentStyle: { shapeColor: "nodeColorCurrent" },
		 *	   nodeUnresolvedStyle: { color: "nodeColorUnresolved" },
		 *	   nodeExternalStyle: { shape: "square", shapeColor: "nodeColorExternal", strokeColor: "inherit", nodeScale: 0.8 },
		 *	   tagDefaultStyle: { shape: 'circle', shapeSize: 6, shapeColor: 'backgroundColor', strokeColor: "nodeColorTag", strokeWidth: 1, colliderScale: 1, nodeScale: 1, neighborScale: 0.7 },
		 *
		 *     linkWidth: 1,
		 *     linkHoverWidth: 1,
		 *
		 *     arrowSize: 5,
		 *     arrowAngle: Math.PI / 6,
		 *
		 *     repelForce: 0.5,
		 *     centerForce: 0.05,
		 *     linkDistance: 30,
		 * }```
		 */
		graphConfig: globalGraphConfigSchema.default({}),

		/**
		 * Configuration for the sitemap generation.
		 *
		 * @default ```{
		 *    contentRoot: './src/content/docs',
		 *    includeExternalLinks: false,
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
