import fs from 'node:fs';

import { type AstroIntegrationLogger } from 'astro';
import { addVirtualImports, defineIntegration } from 'astro-integration-kit';

import { fileURLToPath } from 'node:url';

import { starlightSiteGraphConfig, starlightSiteGraphConfigSchema, validateConfig } from './config';
import { SiteMapBuilder } from './sitemap/build';
import { processSitemap } from './sitemap/process';
import { trimSlashes } from './sitemap/util';

// FIXME: Add direct dependency, as it might get removed by Astro later
import chalk from "chalk";

function log(logger: AstroIntegrationLogger, type: "info" | "warn" | "error", title: string, details: { cause?: string, impact?: string, fix?: string, trace?: string | undefined } = {}) {
	let msg = `${title}\n`;
	if (details.cause) {
		msg += `  ${chalk.bold("Cause")}:\n    ${details.cause}\n`;
	}
	if (details.impact) {
		msg += `  ${chalk.bold("Impact")}:\n    ${details.impact}\n`;
	}
	if (details.fix) {
		msg += `  ${chalk.bold("Fix")}:\n    ${details.fix}\n`;
	}
	if (details.trace) {
		msg += `  ${chalk.bold("Stack Trace")}:\n    ${chalk.gray(details.trace)}\n`;
	}

	msg = msg.replace(/`([^`]+)`/g, (_, code) => chalk.dim(code));
	msg = msg.slice(0, -1);

	logger[type](msg);
}

/**
 * Generates a static sitemap for all md files in the docs directory inside public/sitemap.json,
 * consumed by graph generating code
 */
export default defineIntegration({
	name: 'starlight-site-graph-integration',
	optionsSchema: starlightSiteGraphConfigSchema,
	setup({ name, options }) {
		if (!options.starlight) {
			// EXPL: This codepath is hit if the integration was called directly, without going through the Starlight plugin.
			// 		 The flag is currently only used to identify what default contentRoot to use
			options = { ...validateConfig(starlightSiteGraphConfig, options), starlight: false };
		}
		let settings = options as typeof starlightSiteGraphConfig;

		const builder = new SiteMapBuilder(settings.sitemapConfig);
		const sitemapProvided = !!settings.sitemapConfig.sitemap;
		let outputPath: string;

		return {
			hooks: {
				'astro:config:setup': async (args) => {
					const { config, logger, command, updateConfig, injectScript } = args;

					// Track if sitemap generation was successful
					let sitemapGenerationFailed = false;

					if (!settings.sitemapConfig.contentRoot) {
						settings.sitemapConfig.contentRoot = trimSlashes(config.srcDir.pathname);
						if (settings.starlight) {
							settings.sitemapConfig.contentRoot += "/content/docs";
						} else {
							settings.sitemapConfig.contentRoot += "/pages";
						}
					}

					const addTrailingSlash = config.trailingSlash !== 'never';
					builder.setTrailingSlash(addTrailingSlash);

					// TODO: Figure if it is somehow possible to conditionally import astro:prefetch without triggering vite errors
					if (!config.prefetch) {
						log(logger, "warn", 'Astro `prefetch` is disabled', {
							impact: 'The site graph requires prefetching to function correctly; it has been auto-enabled',
							fix: 'Set `prefetch: true` in your `astro.config.mjs` to suppress this warning'
						});
						config.prefetch = true;
					}

					// Adapted from @shishkin/astro-pagefind
					if (config.adapter?.name.startsWith("@astrojs/vercel")) {
						outputPath = fileURLToPath(new URL(".vercel/output/static/", config.root));
					} else if (config.adapter?.name === "@astrojs/cloudflare") {
						outputPath = fileURLToPath(new URL(config.base?.replace(/^\//, ""), config.outDir));
					} else if (config.adapter?.name === "@astrojs/node" && config.output === "server") {
						outputPath = fileURLToPath(config.build.client!);
					} else {
						outputPath = fileURLToPath(config.outDir);
					}

					if (settings.sitemapConfig.sitemap === undefined) {
						log(logger, "info",
							'Retrieving links from Markdown content' +
							(settings.sitemapConfig.pageInclusionRules.length
								? ` (with patterns \`${settings.sitemapConfig.pageInclusionRules.join('`, `')}\`)`
								: ''),
						);

						// Generate sitemap (links, backlinks, tags, nodeStyle) from Markdown content
						if (command === 'dev' || command === 'build') {
							builder.setBasePath(config.base);
							try {
								await fs.promises.access(settings.sitemapConfig.contentRoot);
							} catch (e) {
								sitemapGenerationFailed = true;
								log(logger, "error",'Sitemap generation from Markdown failed', {
									cause: `Content directory not found: "\`${settings.sitemapConfig.contentRoot}\`"`,
									impact: 'The graph visualization will be empty',
									fix: `Ensure "\`${settings.sitemapConfig.contentRoot}\`" exists`
								});

								// Initialize with empty sitemap to allow integration to continue
								settings.sitemapConfig.sitemap = builder.process().toSitemap();
							}

							// Only attempt to add content if directory exists
							if (!sitemapGenerationFailed) {
								try {
									await builder.addMDContentFolder(trimSlashes(settings.sitemapConfig.contentRoot), settings.sitemapConfig.pageInclusionRules)
									settings.sitemapConfig.sitemap = builder.process().toSitemap();
									log(logger, "info", 'Successfully generated sitemap from Markdown content');
								} catch (e) {
									sitemapGenerationFailed = true;

									log(logger, "error", 'Sitemap generation from Markdown failed', {
										cause: 'Failed to process Markdown content: ' + (e instanceof Error ? e.message : String(e)),
										impact: 'The graph visualization will be empty',
										trace: e instanceof Error ? e.stack : undefined,
									});


									// Initialize with empty sitemap to allow integration to continue
									settings.sitemapConfig.sitemap = builder.process().toSitemap();
								}
							}
						}
					} else {
						log(logger, "info", 'Using applied sitemap');
						settings.sitemapConfig.sitemap = processSitemap(settings.sitemapConfig.sitemap, settings);
					}

					if (command === 'dev' && settings.debug) {
						let pixiStatsPlugin = null;
						try {
							pixiStatsPlugin = require('pixi-stats').default();
						} catch (err) {
							log(logger, "error",
								`Failed to load \`pixi-stats\`, to enable performance monitoring for the graph view, ` +
								`make sure \`pixi-stats\` is installed as a peer dependency`
							);
						}

						updateConfig({
							vite: {
								plugins: pixiStatsPlugin ? [pixiStatsPlugin] : [],
								ssr: {
									noExternal: ['pixi-stats'],
								},
							},
						});
					}

					// NOTE: Always add virtual imports, even if sitemap generation failed
					// 		 This ensures the integration continues to work with an empty graph
					addVirtualImports(args, {
						name,
						imports: {
							'virtual:starlight-site-graph/config': `export default ${JSON.stringify(settings)}`,
							'virtual:starlight-site-graph/astro-config': `export default ${JSON.stringify(config)}`,
						},
					});

					if (sitemapGenerationFailed) {
						log(logger, "warn",`Empty sitemap was generated, the graph visualization will be empty`);
					} else if (command === "dev") {
						const nodeCount = Object.keys(settings.sitemapConfig.sitemap ?? {}).length;
						const linkCount = Object.values(settings.sitemapConfig.sitemap ?? {}).reduce(
							(sum, node) => {
								return sum + (node.links?.length ?? 0)
							}, 0);
						log(logger, "info", `Sitemap with ${nodeCount} nodes and ${linkCount} links generated and injected into virtual module`);
					}

					injectScript("page", `
						import config from 'virtual:starlight-site-graph/config';
						if (config.trackVisitedPages !== 'disable') {
							const storage = config.trackVisitedPages === 'session' ? sessionStorage : localStorage;
							const visited = new Set(JSON.parse(storage.getItem('starlight-site-graph--visited-pages') ?? '[]'));
							visited.add(new URL(window.location.href).pathname.slice(1));
							storage.setItem('starlight-site-graph--visited-pages', JSON.stringify([...visited]));
						}
					`)
				},
				'astro:config:done': async (args) => {
					const { injectTypes } = args;

					injectTypes({
						filename: "types.d.ts",
						content: `declare module 'virtual:starlight-site-graph/config' {
							const Config: import('./packages/starlight-site-graph/config').FullStarlightSiteGraphConfig;
							export default Config;
						}

						declare module 'virtual:starlight-site-graph/astro-config' {
							const Config: import('astro').AstroConfig;
							export default Config;
						}`
					});
				},
				'astro:build:done': async (args) => {
					const { logger } = args;

					if (!outputPath) {
						log(logger, "warn", 'Could not determine output directory', {
							impact: 'Metadata and links extracted from HTML will be missing from the graph',
							fix: 'Check if your SSR adapter is supported or provide a manual output path'
						});
					}

					if (!sitemapProvided) {
						log(logger, "info", 'Retrieving links from generated HTML content');
						try {
							await fs.promises.access(outputPath);
							settings.sitemapConfig.sitemap = (await builder
								.addHTMLContentFolder(outputPath, settings.sitemapConfig.pageInclusionRules))
								.process()
								.toSitemap();
							log(logger, "info", 'Finished generating sitemap from generated HTML content');
						} catch (e) {
							settings.sitemapConfig.sitemap = builder.process().toSitemap();

							log(logger, "warn", 'HTML link extraction failed. Falling back to Markdown-only data', {
								cause: e instanceof Error ? e.message : String(e)
							});
						}
					}

					try {
						const dir = `${outputPath}/sitegraph`
						await fs.promises.mkdir(dir, { recursive: true });
						await fs.promises.writeFile(`${dir}/sitemap.json`,
							JSON.stringify(settings.sitemapConfig.sitemap, null, settings.debug ? 2 : 0)
						);

						const nodeCount = Object.keys(settings.sitemapConfig.sitemap ?? {}).length;
						const linkCount = Object.values(settings.sitemapConfig.sitemap ?? {}).reduce((sum, node) => sum + (node.links?.length ?? 0), 0);

						log(logger, "info",
							`Sitemap created at "\`${dir}/sitemap.json\`" with ${nodeCount} nodes and ${linkCount} links`
						);
					} catch (e) {
						log(logger, "error", 'Failed to write sitemap file to disk', {
							cause: e instanceof Error ? e.message : String(e),
							impact: 'The graph will not be available on the deployed site',
							fix: 'Check disk permissions for the build output directory'
						});
					}
				}
			}
		};
	},
});
