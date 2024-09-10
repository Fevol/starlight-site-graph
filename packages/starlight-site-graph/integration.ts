import fs from 'node:fs';
import path from 'node:path';

import { addVirtualImports, defineIntegration } from 'astro-integration-kit';
import matter from 'gray-matter';

import { type NodeStyle, type SitemapConfig, starlightSiteGraphConfigSchema } from './config';
import {
	ensureTrailingSlash,
	ensureLeadingPound,
	onlyTrailingSlash,
	resolveIndex,
	slugifyPath,
	stripLeadingSlash,
	trimSlashes,
	firstMatchingPattern,
} from './integrationUtil';
import type { Sitemap } from './types';
import type { PageFrontmatter } from './schema';

async function* walk(dir: string): AsyncGenerator<string> {
	for await (const d of await fs.promises.opendir(dir)) {
		const entry = path.join(dir, d.name);
		if (d.isDirectory()) yield* walk(entry);
		else if (d.isFile()) yield entry;
	}
}

interface IntermediateSitemapEntry {
	external: boolean;
	filePath: string | undefined;
	linkPath: string;
	title: string;
	tags: Set<string>;
	links: Set<string>;
	backlinks: Set<string>;
	nodeStyle: Partial<NodeStyle>;
}

class SiteMapBuilder {
	private map: Map<string, IntermediateSitemapEntry>;
	private contentRoot: string;
	basePath!: string;

	constructor(private config: SitemapConfig) {
		this.map = new Map();
		this.contentRoot = trimSlashes(this.config.contentRoot);
	}

	setBasePath(basePath: string) {
		this.basePath = trimSlashes(basePath);
	}

	async addHTMLContent(filePath: string) {
		// Path of built file is structured as `dist/A/B/index.html` where `A/B` is the slug of the page
		const linkPath = this.getLinkPath(filePath.slice(0, -5), this.basePath, '');
		let links = new Set<string>();

		const content = await fs.promises.readFile(filePath, 'utf8');
		for (const match of content.match(/([\w|data-]+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/gm) ?? []) {
			if (match.startsWith('href')) {
				const link = match.slice(6, match.endsWith('"') ? -1 : 0);
				if (link.length && !(link.startsWith("#") || link.startsWith("/_astro/") || link.endsWith(".svg")) && onlyTrailingSlash(link) !== linkPath) {
					if (this.config.includeExternalLinks || !link.startsWith('http')) {
						links.add(onlyTrailingSlash(link));
					}
				}
			}
		}

		if (this.map.has(linkPath)) {
			const entry = this.map.get(linkPath)!;
			this.map.set(linkPath, {
				...entry,
				links: new Set([...links, ...entry.links]),
			});
		}
	}

	async addMDContent(filePath: string) {
		const extname = path.extname(filePath);
		if (!(extname === '.md' || extname === '.mdx' || extname === '.mdoc')) return;

		const linkPath = this.getLinkPath(filePath, this.contentRoot, this.basePath);

		let title = path.basename(linkPath, extname);
		let links = new Set<string>();
		const tags = new Set<string>();
		let nodeStyle = {} as Partial<NodeStyle>;

		const content = await fs.promises.readFile(filePath, 'utf8');
		const frontmatter = matter(content) as unknown as { data: PageFrontmatter };
		for (const match of content.match(/\[.*?]\((.*?)\)/g) ?? []) {
			let link = match.match(/\((.*?)\)/)![1]!;
			if (!link.startsWith('http')) {
				link = slugifyPath(link);
				if (link.startsWith('.')) {
					link = path.join(linkPath, link);
				}

				link = onlyTrailingSlash(link.split('#')[0]!);
				if (link !== linkPath) {
					links.add(link);
				}
			} else if (this.config.includeExternalLinks) {
				links.add(ensureTrailingSlash(link));
			}
		}

		if (frontmatter.data) {
			if (frontmatter.data.sitemap?.include === false) return;

			title = frontmatter.data.title ?? title;
		}

		const currentLinkRules = (frontmatter.data?.sitemap?.linkInclusionRules ?? []).concat(
			this.config.pageInclusionRules,
		);
		if (currentLinkRules.length) {
			links = new Set([...links].filter(link => firstMatchingPattern(link, currentLinkRules, false)));
		}

		if (this.config.styleRules.size) {
			for (const [rules, style] of this.config.styleRules) {
				const ruleResult = firstMatchingPattern(linkPath, rules);
				if (ruleResult) {
					nodeStyle = {
						...nodeStyle,
						...(style as NodeStyle),
					};
				}
			}
		}

		if (frontmatter.data) {
			if (frontmatter.data.links) {
				for (const link of [].concat(frontmatter.data.links)) {
					links.add(onlyTrailingSlash(link));
				}
			}

			if (frontmatter.data.tags) {
				for (const tag of [].concat(frontmatter.data.tags)) {
					tags.add(tag);
				}
			}

			if (frontmatter.data.graph?.nodeStyle) {
				nodeStyle = {
					...nodeStyle,
					...(frontmatter.data.graph.nodeStyle as NodeStyle),
				};
			}
		}

		for (const [tag, tagRule] of Object.entries(this.config.tagRules)) {
			const ruleResult = firstMatchingPattern(linkPath, tagRule);
			if (ruleResult) {
				tags.add(tag);
			} else if (ruleResult !== undefined) {
				tags.delete(tag);
			}
		}

		this.map.set(linkPath, {
			external: false,
			filePath,
			linkPath,
			title,
			tags,
			links,
			backlinks: new Set<string>(),
			nodeStyle,
		});
	}

	/**
	 * Add unresolved links to the map and determine backlinks for each entry
	 */
	process() {
		for (const [_, entry] of this.map) {
			for (const link of entry.links) {
				if (!this.map.has(link)) {
					this.map.set(link, {
						external: link.startsWith('http'),
						filePath: undefined,
						linkPath: link,
						title: path.basename(link),
						tags: new Set(),
						links: new Set(),
						backlinks: new Set(),
						nodeStyle: {},
					});
				}
			}
		}

		// Determine backlinks for each entry
		for (const [_, entry] of this.map) {
			for (const link of entry.links) {
				this.map.get(link)!.backlinks.add(entry.linkPath);
			}
		}
		return this;
	}

	/**
	 * Convert the intermediate sitemap to the final sitemap
	 */
	toSitemap(): Sitemap {
		return Object.fromEntries(
			Array.from(this.map.entries()).map(([_, entry]) => [entry.linkPath, {
				external: entry.external,
				exists: entry.filePath !== undefined || entry.external,
				title: entry.title,
				tags: [...entry.tags].map(ensureLeadingPound),
				links: [...entry.links],
				backlinks: [...entry.backlinks],
				nodeStyle: entry.nodeStyle,
			}]),
		);
	}

	/**
	 * Get the link path for a given file path
	 * @param filePath - The file path to get the link path for
	 * @param contentRoot - The base path to resolve the relative path
	 * @param basePath - The base path to prepend to the link path
	 * @private
	 */
	private getLinkPath(filePath: string, contentRoot: string, basePath: string): string {
		// Resolve the relative path and then remove the extension
		let relative_path = path
			.relative(contentRoot, filePath)
			.replace(/\\/g, '/')
			.slice(0, -path.extname(filePath).length || undefined);

		// Ensure that the slashes are correct and honor the base option
		relative_path = basePath === '' ? stripLeadingSlash(relative_path) : path.join(basePath, relative_path);

		// Slugify the path, keeping slashes
		relative_path = slugifyPath(relative_path);

		// Remove index from the end of the path
		return ensureTrailingSlash(resolveIndex(relative_path));
	}
}

/**
 * Generates a static sitemap for all md files in the docs directory inside public/sitemap.json,
 * consumed by graph generating code
 */
export default defineIntegration({
	name: 'starlight-sitemap-integration',
	optionsSchema: starlightSiteGraphConfigSchema,
	setup({ name, options }) {
		const { sitemapConfig } = options;
		const builder = new SiteMapBuilder(sitemapConfig);

		return {
			hooks: {
				'astro:config:setup': async params => {
					if (!options.sitemapConfig.sitemap) {
						params.logger.info(
							'Retrieving links from Markdown content' +
							(sitemapConfig.pageInclusionRules.length
								? ` (with patterns ${sitemapConfig.pageInclusionRules.join(', ')})`
								: ''),
						);

						// Generate sitemap (links, backlinks, tags, nodeStyle) from markdown content
						if (params.command === 'dev' || params.command === 'build') {
							builder.setBasePath(params.config.base);
							// Parse all markdown files in the contentRoot
							for await (const p of walk(sitemapConfig.contentRoot)) {
								if (firstMatchingPattern(p, sitemapConfig.pageInclusionRules, false)) {
									await builder.addMDContent(p);
								}
							}

							let sitemap: Sitemap = {};
							if (params.command === 'dev') {
								sitemap = builder.process().toSitemap();
							}
							options.sitemapConfig.sitemap = sitemap;
							params.logger.info('Finished generating sitemap from site content');
						}
					} else {
						params.logger.info('Using applied sitemap');

						// Apply tagRules and styleRules to the existing sitemap
						for (const [linkPath, entry] of Object.entries(options.sitemapConfig.sitemap!)) {
							const tags = new Set<string>(entry.tags);
							for (const [tag, tagRules] of Object.entries(sitemapConfig.tagRules)) {
								const ruleResult = firstMatchingPattern(linkPath, tagRules);
								if (ruleResult) {
									tags.add(tag);
								} else if (ruleResult !== undefined) {
									tags.delete(tag);
								}
							}
							entry.tags = [...tags].map(ensureLeadingPound);

							let nodeStyle = {} as Partial<NodeStyle>;
							for (const [rules, style] of options.sitemapConfig.styleRules ?? []) {
								const ruleResult = firstMatchingPattern(linkPath, rules);
								if (ruleResult) {
									nodeStyle = {
										...nodeStyle,
										...(style as NodeStyle),
									};
								}
							}
							entry.nodeStyle = {
								...entry.nodeStyle,
								...nodeStyle,
							};
						}
					}

					addVirtualImports(params, {
						name,
						imports: {
							'virtual:starlight-site-graph/config': `export default ${JSON.stringify(options)}`,
						},
					});

					params.injectScript("page", `
						import config from 'virtual:starlight-site-graph/config';
						if (config.trackVisitedPages) {
							const storage = config.storageLocation === 'session' ? sessionStorage : localStorage;
							const visited = new Set(JSON.parse(storage.getItem(config.storageKey + 'visited') ?? '[]'));
							visited.add(new URL(window.location.href).pathname.slice(1));
							storage.setItem(config.storageKey + 'visited', JSON.stringify([...visited]));
						}
					`)
				},
				'astro:build:done': async params => {
					params.logger.info('Retrieving links from generated HTML content');
					if (!Object.keys(options.sitemapConfig.sitemap!).length) {
						builder.setBasePath(params.dir.pathname);
						for await (const p of walk(builder.basePath)) {
							if (path.extname(p) === '.html') {
								await builder.addHTMLContent(p);
							}
						}

						options.sitemapConfig.sitemap = builder.process().toSitemap();
					}

					await fs.promises.mkdir('public/sitegraph', { recursive: true });
					await fs.promises.writeFile('public/sitegraph/sitemap.json', JSON.stringify(options.sitemapConfig.sitemap, null, 2));
				}
			}
		};
	},
});
