import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSiteGraph from 'starlight-site-graph';
import starlightLinksValidator from 'starlight-links-validator';

export default defineConfig({
	site: "https://fevol.github.io",
	base: "/starlight-site-graph",
	integrations: [
		starlight({
			title: 'Starlight Site Graph',
			credits: true,
			social: {
				discord: 'https://discord.com/users/264169866511122432',
				github: 'https://github.com/fevol/starlight-site-graph'
			},
			editLink: {
				baseUrl: 'https://github.com/fevol/starlight-site-graph/edit/main/docs/',
			},
			customCss: [
				'./src/styles/global.css'
			],
			plugins: [
				starlightLinksValidator({
					errorOnInvalidHashes: false
				}),
				starlightSiteGraph({
					debug: false,
					trackVisitedPages: false,
					graphConfig: {
						depth: 1,
						renderArrows: true,
						tagRenderMode: 'same'
					},
					sitemapConfig: {
						// pageInclusionRules: [ "**/configuration/**" ],
						includeExternalLinks: true,
					}
				}),
			],
			sidebar: [
				{
					label: 'Start Here',
					items: [{ label: 'Getting Started', link: '/getting-started/' }],
				},
				{
					label: 'Configuration',
					items: [
						{ label: 'Configuration', link: '/configuration/' },
						{ label: 'Graph Configuration', autogenerate: { directory: 'configuration/graph' } },
					]
				},
				{
					label: 'Examples',
					autogenerate: { directory: 'examples' },
				},
			],
		}),
	],
	devToolbar: { enabled: false },
	vite: {
		optimizeDeps: {
			exclude: ["node_modules/pixi-stats"]
		}
	}
});
