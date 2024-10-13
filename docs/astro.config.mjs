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
					graphConfig: {
						depth: 1,
						renderArrows: true,
						tagRenderMode: 'same',
						actions: ['fullscreen', 'depth', 'reset-zoom', 'render-arrows', 'render-external', 'settings']
					},
					sitemapConfig: {
						includeExternalLinks: true
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
						{ label: 'Overview', link: '/configuration/' },
						{ label: 'General', link: '/configuration/general' },
						{ label: 'Frontmatter', autogenerate: { directory: 'configuration/frontmatter' } },
						{ label: 'Sitemap', autogenerate: { directory: 'configuration/sitemap' } },
						{ label: 'Graph', autogenerate: { directory: 'configuration/graph' } },
						{ label: 'Backlinks', autogenerate: { directory: 'configuration/backlinks' } },
						{ label: 'CSS', autogenerate: { directory: 'configuration/css' } },
					]
				},
				{
					label: 'Components',
					autogenerate: { directory: 'components' },
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
