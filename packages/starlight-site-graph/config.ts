import { AstroError } from "astro/errors";
import { z } from "astro/zod";


export const defaultGraphConfig: GraphConfig = {
    enableDrag: true,
    enableZoom: true,
    depth: 1,
    scale: 1.1,

    opacityScale: 1.3,
    autoScale: true,
    focusOnHover: true,
    renderArrows: false,
    labelOffset: 8,
    labelHoverOffset: 6,

    repelForce: 0.5,
    centerForce: 0.3,
    linkDistance: 30,

    showTags: false,
    removeTags: [],
    customFolderTags: {},

    regularNodeColor: "#FFFFFF",
    hoveredNodeColor: "#815CEC",
    unhoveredNodeColor: "#3C3C3C",
    currentNodeColor: "#28954B",
    visitedNodeColor: "#1F9389",

    regularNodeOpacity: 1,
    hoveredNodeOpacity: 1,
    unhoveredNodeOpacity: 1,

    regularLinkColor: "#FFFFFF",
    hoveredLinkColor: "#815CEC",
    unhoveredLinkColor: "#FFFFFF",

    regularLinkOpacity: 1,
    hoveredLinkOpacity: 1,
    unhoveredLinkOpacity: 0.05,
};

export type GraphConfig = {
    enableDrag: boolean,
    enableZoom: boolean,
    depth: number,

    scale: number,
    autoScale: boolean,
    renderArrows: boolean,
    opacityScale: number,
    focusOnHover: boolean,
    labelOffset: number,
    labelHoverOffset: number,

    repelForce: number,
    centerForce: number,
    linkDistance: number,

    customFolderTags: Record<string, string>,
    showTags: boolean,
    removeTags: string[],

    regularNodeColor: string,
    hoveredNodeColor: string,
    unhoveredNodeColor: string,
    currentNodeColor: string,
    visitedNodeColor: string,

    regularNodeOpacity: number,
    hoveredNodeOpacity: number,
    unhoveredLinkOpacity: number,


    regularLinkColor: string,
    hoveredLinkColor: string,
    unhoveredLinkColor: string,

    regularLinkOpacity: number,
    hoveredLinkOpacity: number,
    unhoveredNodeOpacity: number,
};

export const starlightSiteGraphConfigSchema = z
    .object({
        /**
         * The root directory of the content to generate links from
         *
         * @default "docs"
         */
        contentRoot: z.string().default("./src/content/docs"),
        storageKey: z.string().default("graph-"),
        storageLocation: z.union([z.literal("none"), z.literal("session"), z.literal("local")]).default("session"),

        /**
         * Configuration for the graph
         *
         * @default {
         *     enableDrag: true,
         *     enableZoom: true,
         *     depth: 1,
         *     scale: 1.1,
         *
         *     opacityScale: 1.3,
         *     autoScale: true,
         *     focusOnHover: true,
         *     renderArrows: false,
         *     labelOffset: 8,
         *     labelHoverOffset: 6,
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
        graphConfig: z.object({
            enableDrag: z.boolean().default(defaultGraphConfig.enableDrag),
            enableZoom: z.boolean().default(defaultGraphConfig.enableZoom),
            depth: z.number().default(defaultGraphConfig.depth),
            scale: z.number().default(defaultGraphConfig.scale),

            opacityScale: z.number().default(defaultGraphConfig.opacityScale),
            autoScale: z.boolean().default(defaultGraphConfig.autoScale),
            focusOnHover: z.boolean().default(defaultGraphConfig.focusOnHover),
            renderArrows: z.boolean().default(defaultGraphConfig.renderArrows),
            labelOffset: z.number().default(defaultGraphConfig.labelOffset),
            labelHoverOffset: z.number().default(defaultGraphConfig.labelHoverOffset),

            repelForce: z.number().default(defaultGraphConfig.repelForce),
            centerForce: z.number().default(defaultGraphConfig.centerForce),
            linkDistance: z.number().default(defaultGraphConfig.linkDistance),

            showTags: z.boolean().default(defaultGraphConfig.showTags),
            removeTags: z.array(z.string()).default(defaultGraphConfig.removeTags),
            customFolderTags: z.record(z.string()).default(defaultGraphConfig.customFolderTags),

            regularNodeColor: z.string().default(defaultGraphConfig.regularNodeColor),
            hoveredNodeColor: z.string().default(defaultGraphConfig.hoveredNodeColor),
            unhoveredNodeColor: z.string().default(defaultGraphConfig.unhoveredNodeColor),
            currentNodeColor: z.string().default(defaultGraphConfig.currentNodeColor),
            visitedNodeColor: z.string().default(defaultGraphConfig.visitedNodeColor),

            regularNodeOpacity: z.number().default(defaultGraphConfig.regularNodeOpacity),
            hoveredNodeOpacity: z.number().default(defaultGraphConfig.hoveredNodeOpacity),
            unhoveredNodeOpacity: z.number().default(defaultGraphConfig.unhoveredNodeOpacity),

            regularLinkColor: z.string().default(defaultGraphConfig.regularLinkColor),
            hoveredLinkColor: z.string().default(defaultGraphConfig.hoveredLinkColor),
            unhoveredLinkColor: z.string().default(defaultGraphConfig.unhoveredLinkColor),

            regularLinkOpacity: z.number().default(defaultGraphConfig.regularNodeOpacity),
            hoveredLinkOpacity: z.number().default(defaultGraphConfig.hoveredLinkOpacity),
            unhoveredLinkOpacity: z.number().default(defaultGraphConfig.unhoveredLinkOpacity),


        }).default(defaultGraphConfig),
        sitemap: z.record(z.string(), z.object({
            title: z.string(),
            content: z.string().optional(),
            links: z.array(z.string()),
            backlinks: z.array(z.string()),
            tags: z.array(z.string())
        })).optional()
    }).default({
        contentRoot: "./src/content/docs",
        graphConfig: defaultGraphConfig
    });


export type StarlightSiteGraphConfig = z.infer<typeof starlightSiteGraphConfigSchema>;

export function validateConfig(userConfig: unknown): StarlightSiteGraphConfig {
    const config = starlightSiteGraphConfigSchema.safeParse(userConfig);

    if (!config.success) {
        const errors = config.error.flatten();
        throw new AstroError(
            `Invalid starlight-site-graph configuration:

            ${errors.formErrors
                .map((formError) => ` - ${formError}`)
                .join("\n")}
            ${Object.entries(errors.fieldErrors)
                .map(
                    ([fieldName, fieldErrors]) =>
                        `- ${fieldName}: ${JSON.stringify(fieldErrors)}`
                )
                .join("\n")}
            `
        );
    }

    return config.data;
}
