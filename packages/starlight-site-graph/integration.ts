import { defineIntegration, addVirtualImports } from "astro-integration-kit";
import {starlightSiteGraphConfigSchema} from "./config";

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
                "astro:config:setup": (params) => {
                    addVirtualImports(params, {
                        name,
                        imports: {
                            "virtual:starlight-site-graph/config": `export default ${JSON.stringify(
                                options
                            )}`,
                        },
                    });
                },
                "astro:server:start": async ({logger}) => {
                    logger.info("Mapping site links...");
                    const sitemap = siteMapDict();
                    for await (const p of walk(options.contentRoot)) {
                        if (!p.endsWith(".md")) continue;

                        const content = await fs.promises.readFile(p, "utf8");
                        const path = p.replace(/\\/g, "/").slice(0, -3);
                        const links = content.match(/\[.*?]\((.*?)\)/g);
                        const entry_name = path.slice(options!.contentRoot.length + 1).toLowerCase();
                        const sitemap_entry = sitemap[entry_name]!;
                        sitemap_entry.title = path.split("/").pop()!;
                        if (links) {
                            sitemap_entry.links = [...new Set(links
                                .reduce((acc: string[], link: string) => {
                                    const url = link.match(/\((.*?)\)/)![1]!;
                                    if (!url.startsWith("http"))
                                        acc.push(url.slice(1));
                                    return acc;
                                }, [])
                                .map((link: string) => link
                                    .split("/").slice(0, -1).join("/")
                                    .replace(/^.\/(\.\.\/)+/, "")
                                )
                                .filter(link => link !== entry_name)
                            )];

                            for (const link of sitemap_entry.links)
                                sitemap[link]!.backlinks.push(entry_name);
                        }
                        sitemap[entry_name] = sitemap_entry;
                    }

                    for (const entry of Object.keys(sitemap)) {
                        const sitemap_entry = sitemap[entry]!;
                        sitemap_entry.backlinks = [...new Set(sitemap_entry.backlinks)];
                        sitemap[entry] = sitemap_entry;
                    }
                    await fs.promises.writeFile("./public/sitemap.json", JSON.stringify(sitemap, null, 2));
                    logger.info("Site links mapped.");
                }
            }
        }
    }
});
