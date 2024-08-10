import { defineIntegration, addVirtualImports } from "astro-integration-kit";
import {starlightSiteGraphConfigSchema} from "./config";
import matter from 'gray-matter';

import fs from "node:fs";
import path from "node:path";

async function* walk(dir: string): AsyncGenerator<string> {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

interface SitemapEntry {
    title: string;
    content: string;
    links: string[];
    backlinks: string[];
    tags: string[];
}

type Sitemap = Record<string, SitemapEntry>;

function siteMapDict() {
    const handler = {
        get: function (target: Sitemap, key: string) {
            if (!(key in target)) {
                const path = key.toString(); // Assuming the key is the path
                target[key] = {
                    title: path.split("/").pop()!,
                    content: "",
                    links: [],
                    backlinks: [],
                    tags: []
                };
            }
            return target[key];
        }
    };
    return new Proxy({}, handler);
}

/**
 * Generates a static sitemap for all md files in the docs directory inside public/sitemap.json,
 * consumed by graph generating code
 */
export default defineIntegration({
    name: "starlight-sitemap-integration",
    optionsSchema: starlightSiteGraphConfigSchema,
    setup({ name, options }) {
        return {
            hooks: {
                "astro:config:setup": async (params) => {
                    if (!options.sitemap) {
                        params.logger.info("Generating sitemap from content links");
                        const sitemap = siteMapDict();
                        for await (const p of walk(options.contentRoot)) {
                            if (!p.endsWith(".md")) continue;

                            const content = await fs.promises.readFile(p, "utf8");
                            const links = content.match(/\[.*?]\((.*?)\)/g);

                            const relative_path = path.relative(options.contentRoot, p).replace(/\\/g, "/").slice(0, -3);
                            const sitemap_entry = sitemap[relative_path]!;

                            const frontmatter = matter(content);
                            if (frontmatter.data) {
                                sitemap_entry.title = frontmatter.data.title;
                                sitemap_entry.links = frontmatter.data.links ?? [];
                            }
                            sitemap_entry.title ??= relative_path.split("/").pop()!;

                            if (links) {
                                // FIXME: Catch links that are not formatted as [text](link)
                                // FIXME: Catch relative links
                                sitemap_entry.links = [...new Set([...sitemap_entry.links, ...links
                                    .reduce((acc: string[], link: string) => {
                                        const url = link.match(/\((.*?)\)/)![1]!;
                                        if (!url.startsWith("http"))
                                            acc.push(url.slice(1));
                                        return acc;
                                    }, [])
                                    .map((link: string) => link
                                        // .split("/").slice(0, -1).join("/")
                                        .replace(/^.\/(\.\.\/)+/, "")
                                    )
                                    .filter(link => link !== relative_path)
                                ])];

                                for (const link of sitemap_entry.links)
                                    sitemap[link]!.backlinks.push(relative_path);
                            }
                            sitemap[relative_path] = sitemap_entry;
                        }

                        for (const entry of Object.keys(sitemap)) {
                            const sitemap_entry = sitemap[entry]!;
                            sitemap_entry.backlinks = [...new Set(sitemap_entry.backlinks)];
                            sitemap[entry] = sitemap_entry;
                        }

                        options.sitemap = { ...sitemap };
                        params.logger.info("Finished generating sitemap");
                    } else {
                        params.logger.info("Using applied sitemap");
                    }

                    addVirtualImports(params, {
                        name,
                        imports: {
                            "virtual:starlight-site-graph/config": `export default ${JSON.stringify(
                                options
                            )}`,
                        },
                    });
                }
            }
        }
    }
});
