import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSiteGraph from 'starlight-site-graph';
import svelte from '@astrojs/svelte';

export default defineConfig({
	redirects: {
		'/': '/intro',
	},
	integrations: [
		svelte(),
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
						actions: ["settings"],
						depth: 8,
						renderArrows: true,
						scale: 1
					},
				}),
			],
		}),
	],
});
