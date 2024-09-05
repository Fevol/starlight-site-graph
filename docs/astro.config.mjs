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
					debug: true,
					graphConfig: {
						depth: 1,
						nodeDefaultStyle: {
							nodeScale: 1,
							strokeWidth: 8,
						},
						renderArrows: true,
						tagRenderMode: 'same',
						trackVisitedPages: false,
						tagStyles: {
							"obsidian": {
								shapeColor: "nodeColor1",
							},
							"internals": {
								shapeColor: "nodeColor2",
								strokeColor: "nodeColor4",
								strokeWidth: 35,
							}
						}
					},
					sitemapConfig: {
						tagRules: {
							"obsidian": ["**/obsidian/**"],
							"internals": ["**/internals/**"]
						},
						styleRules: new Map([
							[["intro/**"], {
								shape: "circle-hollow",
								nodeScale: 2,
							}]
						]),
					}
				}),
			],
		}),
	],
	devToolbar: { enabled: false },
});
