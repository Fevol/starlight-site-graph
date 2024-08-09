import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightSiteGraph from "starlight-site-graph";

export default defineConfig({
    integrations: [
        starlight({
            title: "Starlight Site Graph",
            credits: true,
            social: {
                github: "https://github.com/fevol/starlight-site-graph",
            },
            editLink: {
                baseUrl: 'https://github.com/fevol/starlight-site-graph/edit/main/docs/',
            },
            components: {},
            plugins: [
                starlightSiteGraph()
            ],
        }),
    ],
});
