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
								color: "nodeColor1",
							},
							"internals": {
								color: "nodeColor2"
							},
							"3": {
								color: "nodeColor3"
							},
							"4": {
								color: "nodeColor4"
							},
							"5": {
								color: "nodeColor5"
							},
							"6": {
								color: "nodeColor6"
							},
							"7": {
								color: "nodeColor7"
							},
							"8": {
								color: "nodeColor8"
							},
							"9": {
								color: "nodeColor9"
							},
						}
					},
					sitemapConfig: {
						tagRules: {
							"obsidian": ["**/obsidian/**"],
							"internals": ["**/internals/**"]
						}
					}
				}),
			],
		}),
	],
	devToolbar: { enabled: false },
});
