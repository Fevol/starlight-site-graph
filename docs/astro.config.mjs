import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSiteGraph from 'starlight-site-graph';

export default defineConfig({
	redirects: {
		'/': '/intro',
	},
	integrations: [
		starlight({
			title: 'Starlight Site Graph',
			credits: true,
			customCss: [
				'./src/styles/global.css'
			],
			sidebar: [
				{
					label: 'Start Here',
					autogenerate: { directory: 'intro' },
				},
				{
					label: 'Configuration',
					autogenerate: { directory: 'configuration' },
				},
			],
			social: {
				github: 'https://github.com/fevol/starlight-site-graph',
			},
			editLink: {
				baseUrl: 'https://github.com/fevol/starlight-site-graph/edit/main/docs/',
			},
			plugins: [
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
		}),
	],
	devToolbar: { enabled: false },
	vite: {
		optimizeDeps: {
			exclude: ["node_modules/pixi-stats"]
		}
	}
});
