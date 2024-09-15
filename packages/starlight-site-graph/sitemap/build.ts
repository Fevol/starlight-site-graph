import type { NodeStyle, Sitemap, SitemapConfig } from '../config';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { PageFrontmatter } from '../schema';
// prettier-ignore
import {
	ensureLeadingPound,
	ensureTrailingSlash, stripLeadingSlash, onlyTrailingSlash, trimSlashes,
	firstMatchingPattern,
	resolveIndex, slugifyPath, walk
} from './util';

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

export class SiteMapBuilder {
	private map: Map<string, IntermediateSitemapEntry>;
	private contentRoot: string;
	private excludedPaths: Set<string> = new Set();
	basePath!: string;

	constructor(private config: SitemapConfig) {
		this.map = new Map();
		this.contentRoot = trimSlashes(this.config.contentRoot);
	}

	setBasePath(basePath: string) {
		this.basePath = trimSlashes(basePath);
		return this;
	}

	async addHTMLContentFolder(folder: string, patterns: string[] = []) {
		for await (const p of walk(folder)) {
			if (path.extname(p) === '.html') {
				if (firstMatchingPattern(p, patterns, false)) {
					await this.addHTMLContent(p);
				}
			}
		}

		return this;
	}

	async addHTMLContent(filePath: string) {
		// Path of built file is structured as `dist/A/B/index.html` where `A/B` is the slug of the page
		const linkPath = this.getLinkPath(filePath.slice(0, -5), this.basePath, '');
		let links = new Set<string>();

		const content = await fs.promises.readFile(filePath, 'utf8');
		for (const match of content.match(/([\w|data-]+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/gm) ?? []) {
			if (match.startsWith('href')) {
				const link = match.slice(6, match.endsWith('"') ? -1 : 0);
				if (link.length && !(link.startsWith("#") || link.startsWith("/_astro/") || link.endsWith(".svg"))) {
					this.resolveLink(linkPath, link, links);
				}
			}
		}

		if (this.excludedPaths.has(linkPath)) {
			return this;
		}

		if (this.config.pageInclusionRules.length) {
			links = new Set([...links].filter(link => firstMatchingPattern(link, this.config.pageInclusionRules, false)));
		}

		if (this.map.has(linkPath)) {
			const entry = this.map.get(linkPath)!;
			this.map.set(linkPath, {
				...entry,
				links: new Set([...links, ...entry.links]),
			});
		} else {
			this.map.set(linkPath, {
				external: false,
				filePath,
				linkPath,
				title: path.basename(linkPath),
				tags: new Set(),
				links,
				backlinks: new Set(),
				nodeStyle: {},
			});
		}

		return this;
	}

	async addMDContentFolder(folder: string, patterns: string[] = []) {
		for await (const p of walk(folder)) {
			if (path.extname(p) === '.md' || path.extname(p) === '.mdx' || path.extname(p) === '.mdoc') {
				if (firstMatchingPattern(p, patterns, false)) {
					await this.addMDContent(p);
				}
			}
		}
		return this;
	}

	async addMDContent(filePath: string) {
		const extname = path.extname(filePath);

		const linkPath = this.getLinkPath(filePath, this.contentRoot, this.basePath);

		let title = path.basename(linkPath, extname);
		let links = new Set<string>();
		const tags = new Set<string>();
		let nodeStyle = {} as Partial<NodeStyle>;

		const content = await fs.promises.readFile(filePath, 'utf8');
		const frontmatter = matter(content) as unknown as { data: PageFrontmatter };
		for (const match of content.match(/\[.*?]\((.*?)\)/g) ?? []) {
			this.resolveLink(linkPath, match.match(/\((.*?)\)/)![1]!, links);
		}

		if (frontmatter.data) {
			if (frontmatter.data.sitemap?.include === false) {
				this.excludedPaths.add(linkPath);
				return this;
			}

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
				for (const link of [].concat(frontmatter.data.links as any)) {
					links.add(onlyTrailingSlash(link));
				}
			}

			if (frontmatter.data.tags) {
				for (const tag of [].concat(frontmatter.data.tags as any)) {
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

		return this;
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

	private resolveLink(current: string, link: string, links: Set<string>) {
		if (!link.startsWith('http')) {
			if (link.startsWith('.')) {
				link = path.join(current, link);
			} else if (this.basePath !== '') {
				link = path.join(this.basePath, link);
			}
			link = slugifyPath(onlyTrailingSlash(link.split('#')[0]!).replace(/\\/g, '/'));
			if (link !== current) {
				links.add(link);
			}
		} else if (this.config.includeExternalLinks) {
			links.add(ensureTrailingSlash(link));
		}
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
		relative_path = basePath === '' ? stripLeadingSlash(relative_path) : path.join(basePath, relative_path).replace(/\\/g, '/');

		// Slugify the path, keeping slashes
		relative_path = slugifyPath(relative_path);

		// Remove index from the end of the path
		return ensureTrailingSlash(resolveIndex(relative_path));
	}
}
