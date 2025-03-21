import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeObsidian from 'starlight-theme-obsidian';
// import starlightSiteGraph from 'starlight-site-graph';
import starlightLinksValidator from 'starlight-links-validator';
import markdocGrammar from './grammars/markdoc.tmLanguage.json';

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
			expressiveCode: { shiki: { langs: [markdocGrammar] } },
			plugins: [
				starlightLinksValidator({
					errorOnInvalidHashes: false
				}),
				starlightThemeObsidian({
					debug: false,
					graphConfig: {
						depth: 1,
						scale: 1,
						labelOpacityScale: 1.5,
						labelFontSize: 11,
						labelHoverScale: 1.3,
						renderArrows: true,
						tagRenderMode: 'same',
						actions: ['fullscreen', 'depth', 'reset-zoom', 'render-arrows', 'render-external', 'settings'],
						nodeDefaultStyle: {
							shape: 'star',
							cornerType: 'round',
							shapeCornerRadius: "25%",
							nodeScale: 1.6,
							neighbourScale: 30.0,
							shapeRotation: 'random',
						},
						nodeExternalStyle: {
							shape: 'star',
							shapePoints: 4,
							nodeScale: 0.9,
						},
						nodeVisitedStyle: {
							nodeScale: 1.1,
						},
						nodeCurrentStyle: {
							shapePoints: 6,
							nodeScale: 2.2,
							shapeRotation: 0,
							colliderScale: 1.4
						}
					},
					sitemapConfig: {
						includeExternalLinks: true
					}
				}),
			],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'Getting Started', link: '/getting-started/' },
						{ label: 'Contributing', link: '/contributing/' },
						{ label: 'Attribution', link: '/attribution/' },
						{ label: 'Changelog', link: '/changelog/' },
					]
				},
				{
					label: 'Concepts',
					autogenerate: { directory: 'concepts' },
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
				}
			],
			components: {
				Head: './src/overrides/Head.astro',
			},
		}),
	],
	devToolbar: { enabled: false },
	vite: {
		optimizeDeps: {
			exclude: ["node_modules/pixi-stats"]
		}
	}
});
