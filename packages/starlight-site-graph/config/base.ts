import { z } from 'astro/zod';

import { globalGraphConfigSchema, globalGraphConfig } from './graph';
import { globalSitemapConfigSchema, globalSitemapConfig } from './sitemap';
import { globalBacklinksConfigSchema, globalBacklinksConfig } from './backlinks';


export const starlightSiteGraphConfig = {
	debug: false,
	trackVisitedPages: 'session' as 'disable' | 'session' | 'local',
	graph: true,
	graphConfig: globalGraphConfig,
	sitemapConfig: globalSitemapConfig,
	backlinks: true,
	backlinksConfig: globalBacklinksConfig,
}

export const starlightSiteGraphConfigSchema = z
	.object({
		/**
		 * Whether debug mode is enabled
		 * - Adds a frametime counter to the graph
		 *
		 * @default false
		 */
		debug: z.boolean().default(starlightSiteGraphConfig.debug),

		/**
		 * Whether to track pages of the website that were visited by the user.
		 * If disabled, the graph will not show visited pages in a different style (defined by `nodeVisitedStyle`). \
		 * The tracking can be set to:
		 * - `disable`: Do not track visited pages
		 * - `session`: Track visited pages for the current session
		 * - `local`: Track visited pages across sessions
		 *
		 * @default "session"
		 */
		trackVisitedPages: z
			.union([z.literal('disable'), z.literal('session'), z.literal('local')])
			.default(starlightSiteGraphConfig.trackVisitedPages as 'disable' | 'session' | 'local'),

		/**
		 * Whether to add a graph component to the sidebar, acts as a global toggle for the graph.
		 *
		 * @remarks If false, it is equivalent to setting `graphConfig.visibilityRules` an empty array
		 * @default true
		 */
		graph: z.boolean().default(starlightSiteGraphConfig.graph),

		/**
		 * Configuration for the PageSidebar graph component.
		 *
		 * @default ```{
		 *     visibilityRules: ["**\/*"],
		 *
		 *     actions: ['fullscreen', 'depth', 'reset-zoom', 'render-arrows', 'settings'],
		 *
		 *     tagStyles: {},
		 *     tagRenderMode: 'none',
		 *
		 * 	   prefetchPages: true,
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
		 *	   nodeUnresolvedStyle: { shapeColor: "nodeColorUnresolved" },
		 *	   nodeExternalStyle: { shape: "square", shapeColor: "nodeColorExternal", strokeColor: "inherit", nodeScale: 0.8 },
		 *	   tagDefaultStyle: { shape: 'circle', shapeSize: 6, shapeColor: 'backgroundColor', strokeColor: "nodeColorTag", strokeWidth: 1, colliderScale: 1, nodeScale: 1, neighborScale: 0.7 },
		 *
		 *     linkWidth: 1,
		 *     linkHoverWidth: 1,
		 *
		 *     arrowSize: 5,
		 *     arrowAngle: Math.PI / 6,
		 *
		 *     centerForce: 0.05,
		 *	   colliderPadding: 20,
		 *     repelForce: 200,
		 *     linkDistance: 0,
		 *     alphaDecay: 0.0228
		 * }```
		 */
		graphConfig: globalGraphConfigSchema.default(starlightSiteGraphConfig.graphConfig),

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
		sitemapConfig: globalSitemapConfigSchema.default(starlightSiteGraphConfig.sitemapConfig),

		/**
		 * Whether to add a backlinks panel to the sidebar, acts as a global toggle for the backlinks.
		 *
		 * @remarks If false, it is equivalent to setting `backlinksConfig.visibilityRules` an empty array
		 * @default true
		 */
		backlinks: z.boolean().default(starlightSiteGraphConfig.backlinks),

		/**
		 * Configuration for the PageSidebar backlinks component.
		 *
		 * @default ```{
		 *   visibilityRules: ["**\/*"],
		 * }```
		 */
		backlinksConfig: globalBacklinksConfigSchema.default(starlightSiteGraphConfig.backlinksConfig),
	})
	.partial()
	.default({});

export type StarlightSiteGraphConfig = z.infer<typeof starlightSiteGraphConfigSchema>;
