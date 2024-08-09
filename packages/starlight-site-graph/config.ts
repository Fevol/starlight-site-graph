import { AstroError } from "astro/errors";
import { z } from "astro/zod";

export const starlightSiteGraphConfigSchema = z
    .object({
        /**
         * The root directory of the content to generate links from
         *
         * @default "docs"
         */
        contentRoot: z.string().default("./"),

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
        config: z.object({
            enableDrag: z.boolean().default(true),
            enableZoom: z.boolean().default(true),
            depth: z.number().default(1),
            scale: z.number().default(1.1),

            opacityScale: z.number().default(1.3),
            autoScale: z.boolean().default(true),
            focusOnHover: z.boolean().default(true),
            renderArrows: z.boolean().default(false),
            labelOffset: z.number().default(8),
            labelHoverOffset: z.number().default(6),

            repelForce: z.number().default(0.5),
            centerForce: z.number().default(0.3),
            linkDistance: z.number().default(30),

            showTags: z.boolean().default(false),
            removeTags: z.array(z.string()).default([]),
            customFolderTags: z.record(z.string()).default({}),
        })
    }).default({
        contentRoot: "./",
        config: {
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
        },
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
