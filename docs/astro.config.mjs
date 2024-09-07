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
						renderArrows: true,
						tagRenderMode: 'same',
						trackVisitedPages: false,
						nodeDefaultStyle: {
							shape: "square",
							shapePoints: 4,
							shapeCornerRadius: 0,
							cornerType: "round",
							strokeColor: "nodeColor8",
							strokeWidth: 2,
							strokeCornerRadius: 4
						}
					},
				}),
			],
		}),
	],
	devToolbar: { enabled: false },
});
