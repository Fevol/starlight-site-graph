import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightSiteGraph from "starlight-site-graph";
import svelte from '@astrojs/svelte'

export default defineConfig({
    integrations: [
        svelte(),
        starlight({
            title: "Starlight Site Graph",
            credits: true,
            sidebar: [
                {
                    label: "Introduction",
                    autogenerate: { directory: "intro" }
                },
            ],
            social: {
                github: "https://github.com/fevol/starlight-site-graph",
            },
            editLink: {
                baseUrl: 'https://github.com/fevol/starlight-site-graph/edit/main/docs/',
            },
            plugins: [
                starlightSiteGraph({
                })
            ],
        }),
    ],
    vite: {
        server: {
            fs: {
                strict: false
            }
        }
    }
});
