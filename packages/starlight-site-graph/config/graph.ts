import { z } from 'astro/zod';

import {
	nodeStyleSchema, nodeDefaultStyle, nodeExternalStyle, nodeCurrentStyle,
	nodeUnresolvedStyle, nodeVisitedStyle, tagDefaultStyle
} from './node';

const easingTypes = z.union([
	z.literal('in_quad'),
	z.literal('out_quad'),
	z.literal('in_out_quad'),
	z.literal('linear'),
]);

const graphConfig = {
	actions: ['fullscreen', 'depth', 'reset-zoom', 'render-arrows', 'settings'] as ('fullscreen' | 'depth' | 'reset-zoom' | 'render-arrows' | 'settings')[],
	tagStyles: {},
	tagRenderMode: 'none' as ('none' | 'node' | 'same' | 'both'),
	nodeInclusionRules: ['**/*'] as const,
	prefetchPages: true,
	enableDrag: true,
	enableZoom: true,
	enablePan: true,
	enableHover: true,
	enableClick: 'auto' as ('auto' | 'disable' | 'click' | 'dblclick'),
	depth: 1,
	depthDirection: 'both' as ('both' | 'incoming' | 'outgoing'),
	followLink: 'same' as ('same' | 'new-tab' | 'graph'),
	scale: 1.1,
	minZoom: 0.05,
	maxZoom: 4,
	renderLabels: true,
	renderArrows: false,
	renderUnresolved: false,
	renderExternal: true,
	scaleLinks: true,
	scaleArrows: true,
	minZoomArrows: 0.8,
	labelOpacityScale: 1.3,
	labelMutedOpacity: 0,
	labelHoverOpacity: 1,
	labelAdjacentOpacity: 1,
	labelFontSize: 12,
	labelHoverScale: 1,
	labelOffset: 10,
	labelHoverOffset: 14,
	zoomDuration: 75,
	zoomEase: 'out_quad' as 'in_quad' | 'out_quad' | 'in_out_quad' | 'linear',
	hoverDuration: 200,
	hoverEase: 'out_quad' as 'in_quad' | 'out_quad' | 'in_out_quad' | 'linear',
	nodeDefaultStyle: nodeDefaultStyle,
	nodeVisitedStyle: nodeVisitedStyle,
	nodeCurrentStyle: nodeCurrentStyle,
	nodeUnresolvedStyle: nodeUnresolvedStyle,
	nodeExternalStyle: nodeExternalStyle,
	tagDefaultStyle: tagDefaultStyle,
	linkWidth: 1,
	linkHoverWidth: 1,
	arrowSize: 5,
	arrowAngle: Math.PI / 6,
	centerForce: 0.05,
	colliderPadding: 20,
	repelForce: 200,
	linkDistance: 0,
	alphaDecay: 0.0228,
};
export const globalGraphConfig = {
	...graphConfig,
	visibilityRules: ['**/*'],
}

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
		.default(graphConfig.actions),

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
			nodeStyleSchema.partial(),
		)
		.default(graphConfig.tagStyles),
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
		.default(graphConfig.tagRenderMode),

	/**
	 * Whether to prefetch pages on hover in the graph component.
	 *
	 * @default true
	 */
	prefetchPages: z.boolean().default(globalGraphConfig.prefetchPages),

	/**
	 * Whether to enable user dragging of nodes in the graph
	 *
	 * @default true
	 */
	enableDrag: z.boolean().default(graphConfig.enableDrag),
	/**
	 * Whether to enable user zooming of the graph
	 *
	 * @default true
	 */
	enableZoom: z.boolean().default(graphConfig.enableZoom),
	/**
	 * Whether to enable user panning of the graph (i.e. moving left/right/up/down)
	 */
	enablePan: z.boolean().default(graphConfig.enablePan),
	/**
	 * Whether to enable hover interactions on the graph
	 * This includes highlighting nodes and links on hover, and showing labels
	 *
	 * @default true
	 */
	enableHover: z.boolean().default(graphConfig.enableHover),
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
		.default(graphConfig.enableClick),


	/**
	 * Determine the inclusion of nodes in the graph based on provided ordered list of rules.
	 * The page is included/excluded if the node's _path_ matches one of the rules.
	 * When a rule starts with `!`, the file is _excluded_ if matched.
	 * Rules are evaluated in order, the first matching rule determines the inclusion of the node.
	 *
	 * @default All nodes are shown by default
	 * ["**\/*"]
	 * @example Only show nodes in the "api" folder:
	 * ["api/**", "!**\/*"]
	 * @example Include all files except those in the "secret" folder:
	 * ["!secret/**", "**\/*"]
	 */
	nodeInclusionRules: z.array(z.string()).default(graphConfig.nodeInclusionRules),

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
	depth: z.number().default(graphConfig.depth),
	/**
	 * In which direction the depth of the graph should be expanded
	 * - `both`: Expand in both incoming and outgoing directions
	 * - `incoming`: Expand only in the incoming direction
	 * - `outgoing`: Expand only in the outgoing direction
	 *
	 * @default "both"
	 */
	depthDirection: z
		.union([z.literal('both'), z.literal('incoming'), z.literal('outgoing')])
		.default(graphConfig.depthDirection),

	/**
	 * Determine what should happen when a link is followed
	 * - `same`: Open the link in the same tab
	 * - `new-tab`: Open the link in a new tab
	 * - `graph`: Set the link as the current node in the graph
	 *
	 * @remark This does _not_ apply to external links, which will always open in a new tab
	 * @default "tab"
	 */
	followLink: z
		.union([z.literal('same'), z.literal('new-tab'), z.literal('graph')])
		.default(graphConfig.followLink),


	/**
	 * The scale of the graph, determines the zoom level
	 *
	 * @default 1.1
	 */
	scale: z.number().gt(0, "Graph scale may not be zero or negative").default(graphConfig.scale),
	/**
	 * The minimum zoom level of the graph
	 *
	 * @default 0.05
	 */
	minZoom: z.number().gt(0, "Graph zoom may not be zero or negative").default(graphConfig.minZoom),
	/**
	 * The maximum zoom level of the graph
	 *
	 * @default 4
	 */
	maxZoom: z.number().gt(0, "Graph zoom may not be zero or negative").default(graphConfig.maxZoom),

	/**
	 * Whether to render page title labels on the nodes
	 *
	 * @default true
	 */
	renderLabels: z.boolean().default(graphConfig.renderLabels),
	/**
	 * Whether to render arrows on the links
	 *
	 * @default true
	 */
	renderArrows: z.boolean().default(graphConfig.renderArrows),
	/**
	 * Whether to render unresolved pages in the graph
	 *
	 * @default false
	 */
	renderUnresolved: z.boolean().default(graphConfig.renderUnresolved),
	/**
	 * Whether to render external pages in the graph
	 *
	 * @remarks External nodes only exist in the sitemap if `includeExternalLinks` of `sitemapConfig` is set to `true`.
	 * @default true
	 */
	renderExternal: z.boolean().default(graphConfig.renderExternal),

	/**
	 * Whether to scale the links based on the zoom level
	 *
	 * @default true
	 */
	scaleLinks: z.boolean().default(graphConfig.scaleLinks),
	/**
	 * Whether to scale the arrows based on the zoom level
	 *
	 * @default false
	 */
	scaleArrows: z.boolean().default(graphConfig.scaleArrows),
	/**
	 * Minimum zoom level at which the arrows are rendered \
	 * When 0, arrows will always be rendered
	 *
	 * @default 0.8
	 */
	minZoomArrows: z.number().min(0, "Minimum zoom for arrow rendering may not be negative").default(graphConfig.minZoomArrows),

	/**
	 * The scale factor for the opacity of the labels, based on the zoom level
	 * A higher value will make the labels more opaque at lower zoom levels
	 *
	 * @default 1.3
	 */
	labelOpacityScale: z.number().min(0, "Opacity scale for labels may not be negative").default(graphConfig.labelOpacityScale),
	/**
	 * The opacity of unhovered labels (when hovering over a node)
	 *
	 * @default 0
	 */
	labelMutedOpacity: z.number().min(0, "Opacity scale for muted labels may not be negative").default(graphConfig.labelMutedOpacity),
	/**
	 * The opacity of the label when hovering over a node
	 *
	 * @default 1
	 */
	labelHoverOpacity: z.number().min(0, "Opacity scale for hovered labels may not be negative").default(graphConfig.labelHoverOpacity),
	/**
	 * The opacity of the label when adjacent to the hovered node. \
	 * If explicitly set to undefined, the `labelMutedOpacity` will be used.
	 */
	labelAdjacentOpacity: z.number().min(0, "Opacity scale for hovered labels may not be negative").optional().default(graphConfig.labelAdjacentOpacity),
	/**
	 * The font size of the labels
	 *
	 * @remarks Labels should be disabled using the `renderLabels` option
	 * @default 12
	 */
	labelFontSize: z.number().min(0, "Label font size may not be negative").default(graphConfig.labelFontSize),
	/**
	 * The scale of the label when hovering over a node
	 *
	 * @default 1
	 */
	labelHoverScale: z.number().min(0, "Label hover scale may not be negative").default(graphConfig.labelHoverScale),
	/**
	 * The offset of the labels from the nodes
	 *
	 * @default 10
	 */
	labelOffset: z.number().min(0, "Label offset may not be negative").default(graphConfig.labelOffset),
	/**
	 * The offset of the label from the node when hovering over said node
	 *
	 * @default 14
	 */
	labelHoverOffset: z.number().min(0, "Label hover offset may not be negative").default(graphConfig.labelHoverOffset),

	/**
	 * The duration of the zoom animation in milliseconds \
	 * This controls the speed of zooming and panning
	 *
	 * @default 75
	 */
	zoomDuration: z.number().min(0, "Zoom duration may not be negative").default(graphConfig.zoomDuration),
	/**
	 * The easing function for the zoom animation
	 * This controls the acceleration of zooming and panning
	 *
	 * @default "out_quad"
	 */
	zoomEase: easingTypes.default(graphConfig.zoomEase),
	/**
	 * The duration of the hover animation in milliseconds
	 * This controls the speed of the node/link/label highlighting transitions
	 *
	 * @default 200
	 */
	hoverDuration: z.number().min(0, "Hover duration may not be negative").default(graphConfig.hoverDuration),
	/**
	 * The easing function for the hover animation
	 * This controls the acceleration of the node/link/label highlighting transitions
	 *
	 * @default "out_quad"
	 */
	hoverEase: easingTypes.default(graphConfig.hoverEase),

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
	nodeDefaultStyle: nodeStyleSchema
		.partial()
		.optional(),
	/**
	 * The style of node representing a visited page in the graph. \
	 * This style overwrites styles defined in `nodeDefaultStyle`.
	 *
	 * @default { shapeColor: "nodeColorVisited" }
	 */
	nodeVisitedStyle: nodeStyleSchema
		.partial()
		.optional(),
	/**
	 * The style of node representing the current page in the graph. \
	 * This style overwrites styles defined in `nodeDefaultStyle` and matching `tagStyles`.
	 *
	 * @default { shapeColor: "nodeColorCurrent" }
	 */
	nodeCurrentStyle: nodeStyleSchema
		.partial()
		.optional(),
	/**
	 * The style of node representing an unresolved page in the graph. \
	 * This style overwrites styles defined in `nodeDefaultStyle`, matching `tagStyles`, and `nodeCurrentStyle`.
	 *
	 * @default { shapeColor: "nodeColorUnresolved" }
	 */
	nodeUnresolvedStyle: nodeStyleSchema
		.partial()
		.optional(),
	/**
	 * The style of node representing an external page in the graph. \
	 * This style overwrites styles defined in `nodeDefaultStyle`, matching `tagStyles`, and `nodeCurrentStyle`.
	 * External nodes only exist in the sitemap if `includeExternalLinks` of `sitemapConfig` is set to `true`.
	 *
	 * @default { shape: "square", shapeColor: "nodeColorExternal", strokeColor: "inherit", nodeScale: 0.8 }
	 */
	nodeExternalStyle: nodeStyleSchema
		.partial()
		.optional(),
	/**
	 * Default style of tag nodes in the graph
	 *
	 * @default { shape: 'circle', shapeSize: 6, shapeColor: 'backgroundColor', strokeColor: "nodeColorTag", strokeWidth: 1, colliderScale: 1, nodeScale: 1, neighborScale: 0.7 }
	 */
	tagDefaultStyle: nodeStyleSchema
		.partial()
		.optional(),

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
	 * The strength of the force that pulls nodes towards the center of the graph. \
	 * A higher value will bring nodes closer together
	 *
	 * @default 0.05
	 */
	centerForce: z.number().min(0, "Center force may not be negative").default(0.05),
	/**
	 * The collision force between nodes in the graph. \
	 * A higher value will make nodes repel each other more strongly, creating an even, grid-like layout
	 *
	 * @default 20
	 */
	colliderPadding: z.number().min(0, "Collider padding may not be negative").default(20),
	/**
	 * The attraction/repulsion force between nodes in the graph. \
	 * A higher value will increase the distance between nodes
	 *
	 * @default 200
	 */
	repelForce: z.number().min(0, "Repel force may not be negative").default(200),
	/**
	 * The distance between linked nodes in the graph. \
	 * If set to 0, link distance are determined by the force simulation
	 *
	 * @default 0
	 */
	linkDistance: z.number().min(0, "Link distance may not be negative").default(0),
	/**
	 * The speed at which the graph stabilizes after a simulation update. \
	 * A higher value will make the graph stabilize faster, but may result in a less accurate layout. \
	 * If set to 0, the graph will run continuously without stabilization.
	 *
	 * @default 0.228
	 */
	alphaDecay: z.number().min(0, "Alpha decay may not be negative").max(1, "Alpha decay may not be greater than 1").default(0.0228),
}).partial()
export type GraphConfig = z.infer<typeof graphConfigSchema>;

export const globalGraphConfigSchema = graphConfigSchema.extend({
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
	visibilityRules: z.array(z.string()).default(globalGraphConfig.visibilityRules),
}).partial();
