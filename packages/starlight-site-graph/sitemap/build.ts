// prettier-ignore
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

import type { PageSiteGraphFrontmatter } from '../schema';
import type { NodeStyle, RemoveOptional, Sitemap, SitemapConfig } from '../config';

import {
	ensureLeadingPound, trimSlashes, setSlashes,
	firstMatchingPattern,
	resolveIndex, slugifyPath, walk, getMostCommonItem, extractMDLinkText, ensureLeadingSlash
} from './util';

import {DomUtils, parseDocument} from 'htmlparser2'

interface IntermediateSitemapEntry {
	external: boolean;
	filePath: string | undefined;
	linkPath: string;
	tags: Set<string>;
	links: Set<string>;
	backlinks: Set<string>;
	nodeStyle: Partial<NodeStyle>;
}


export class SiteMapBuilder {
	private map: Map<string, IntermediateSitemapEntry>;
	private contentRoot: string;
	private excludedPaths: Set<string> = new Set();
	private addTrailingSlash: boolean = false;
	private encounteredFiles: Set<string> = new Set();

	basePath!: string;
	explicitSlugAssociations: Map<string, string> = new Map();
	implicitNameAssociations: Map<string, string[]> = new Map();
	explicitNameAssociations: Map<string, string> = new Map();

	constructor(private config: RemoveOptional<SitemapConfig>) {
		this.map = new Map();
		this.contentRoot = trimSlashes(this.config.contentRoot);
		this.explicitNameAssociations = new Map(
			Object.entries(this.config.pageTitles).map(([k, v]) => [setSlashes(k, true, this.addTrailingSlash), v]),
		);
	}

	setBasePath(basePath: string) {
		this.basePath = trimSlashes(basePath);
		return this;
	}

	setTrailingSlash(addTrailingSlash: boolean) {
		this.addTrailingSlash = addTrailingSlash;
		return this;
	}

	async addHTMLContentFolder(folder: string, patterns: string[] = []) {
		for await (const filePath of walk(folder)) {
			// Skip mapping 404 page
			if (filePath.endsWith('404.html')) continue;

			if (path.extname(filePath) === '.html') {
				const relativePath = ensureLeadingSlash(path.relative(folder, filePath).replace(/\\/g, '/'));
				if (firstMatchingPattern(relativePath, patterns, false)) {
					await this.addHTMLContent(filePath, folder);
				}
			}
		}

		return this;
	}

	async addHTMLContent(filePath: string, folderPath: string) {
		const linkPath = this.getLinkPathFromFilePath(filePath, folderPath);
		this.encounteredFiles.add(linkPath);

		let links = new Set<string>();

		const content = await fs.promises.readFile(filePath, 'utf8');
		const document = parseDocument(content);
		const allLinks = DomUtils.findAll(el => {
			return el.name === 'a' &&
				el.attribs?.['href'] !== undefined &&
				!el.attribs['href'].startsWith('#');
		}, document.children);
		const excludedSelectors = new Set(this.config.ignoreLinksInSelectors);

		const includedLinks = allLinks.filter(el => {
			let current = el;
			while (current && current.type === 'tag') {
				if (
					excludedSelectors.has(current.tagName) ||
					excludedSelectors.has("#" + current.attribs?.['id']) ||
					current.attribs?.['class']?.split(' ').some((c: string) => excludedSelectors.has("." + c))
				) {
					return false;
				}
				current = current.parent as typeof el;
			}
			return true;
		});

		for (const link of includedLinks) {
			let href = this.resolveLink(linkPath, link.attribs['href']!, links);
			if (href) {
				const text = DomUtils.textContent(link).trim() ?? '';
				if (text.length) {
					this.implicitNameAssociations.set(href, [...(this.implicitNameAssociations.get(href) ?? []), text]);
				}
			}
		}

		// TODO: move this above?
		if (this.excludedPaths.has(linkPath)) {
			return this;
		}

		if (this.config.linkInclusionRules.length) {
			links = new Set([...links].filter(link => firstMatchingPattern(link, this.config.linkInclusionRules, false)));
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
				tags: new Set(),
				links,
				backlinks: new Set(),
				nodeStyle: {},
			});
		}

		return this;
	}

	async addMDContentFolder(folder: string, patterns: string[] = []) {
		for await (const filePath of walk(folder)) {
			if (path.extname(filePath) === '.md' || path.extname(filePath) === '.mdx' || path.extname(filePath) === '.mdoc') {
				const relativePath = ensureLeadingSlash(path.relative(folder, filePath).replace(/\\/g, '/'));
				if (firstMatchingPattern(relativePath, patterns, false)) {
					await this.addMDContent(filePath);
				}
			}
		}
		return this;
	}

	async addMDContent(filePath: string) {
		const content = await fs.promises.readFile(filePath, 'utf8');
		const frontmatter = matter(content) as unknown as { data: PageSiteGraphFrontmatter & { slug?: string } };

		let linkPath: string;

		// Use the specified slug from the frontmatter if it exists
		// 	The assumption is made that the `slug` field is always formatted as xx/yy/zz (no relative paths)
		if (frontmatter.data?.slug) {
			linkPath = path.join(this.basePath,
				setSlashes(frontmatter.data.slug, true, this.addTrailingSlash)
			).replace(/\\/g, '/');
			this.explicitSlugAssociations.set(linkPath, frontmatter.data.slug);
		}
		// Otherwise, re-create the Astro slug from the file path
		else {
			linkPath = setSlashes(this.getLinkPath(filePath, this.contentRoot, this.basePath), true, this.addTrailingSlash);
		}

		this.encounteredFiles.add(linkPath);

		let links = new Set<string>();
		const tags = new Set<string>();
		let nodeStyle = {} as Partial<NodeStyle>;


		for (const match of content.match(/\[([^\]]+)\]\(([^)]+)\)/g) ?? []) {
			const link = this.resolveLink(linkPath, match.match(/\((.*?)\)/)![1]!, links);
			if (link) {
				const text = extractMDLinkText(match);
				if (text) {
					this.implicitNameAssociations.set(link, [...(this.implicitNameAssociations.get(link) ?? []), text]);
				}
			}
		}

		if (frontmatter.data) {
			if (frontmatter.data.sitemap?.include === false) {
				this.excludedPaths.add(linkPath);
				return this;
			}

			if (frontmatter.data.sitemap?.pageTitle) {
				this.explicitNameAssociations.set(linkPath, frontmatter.data.sitemap.pageTitle);
			} else if (frontmatter.data.title && !this.explicitNameAssociations.has(linkPath)) {
				this.explicitNameAssociations.set(linkPath, frontmatter.data.title);
			}
		}

		const currentLinkRules = (frontmatter.data?.sitemap?.linkInclusionRules ?? []).concat(
			this.config.linkInclusionRules,
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
					links.add(setSlashes(link, true, this.addTrailingSlash));
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
	 * Resolve the name for a link path based on the official associations, implicit associations, or fallback to the path basename
	 * @param linkPath - The link path to get the name for
	 */
	private resolveLinkName(linkPath: string) {
		let name = this.explicitNameAssociations.get(linkPath);
		if (name === undefined) {
			if (this.config.pageTitleFallbackStrategy === 'linkText') {
				name = getMostCommonItem([...this.implicitNameAssociations.get(linkPath) ?? []]);
			}

			if (name === undefined) {
				name = path.basename(linkPath);
			}

		}

		return name;
	}

	/**
	 * Convert the intermediate sitemap to the final sitemap
	 */
	toSitemap(): Sitemap {
		return Object.fromEntries(
			Array.from(this.map.entries()).map(([_, entry]) => [entry.linkPath, {
				external: entry.external,
				// FIXME: a file that has no link entries is incorrectly marked as non-existent
				exists: this.encounteredFiles.has(entry.linkPath) || entry.external,
				title: this.resolveLinkName(entry.linkPath),
				tags: entry.tags.size ? [...entry.tags].map(ensureLeadingPound) : undefined,
				links: entry.links.size ? [...entry.links] : undefined,
				backlinks: entry.backlinks.size ? [...entry.backlinks] : undefined,
				nodeStyle: Object.keys(entry.nodeStyle).length ? entry.nodeStyle : undefined,
			}]),
		);
	}

	private resolveLink(current: string, link: string, links: Set<string>) {
		if (!(link.startsWith('http') || link.startsWith('mailto:'))) {
			// Leads to the current page, so it can be safely ignored
			if (link.startsWith('#')) {
				return;
			}

			if (link.startsWith('.')) {
				link = path.join(current, link);
			} else if (this.basePath !== '' && !trimSlashes(link).startsWith(this.basePath)) {
				link = path.join(this.basePath, link);
			}
			link = setSlashes(slugifyPath(link.split('#')[0]!.replace(/\\/g, '/')), true, this.addTrailingSlash);
			if (link !== current) {
				links.add(link);
				return link;
			}
		} else if (this.config.includeExternalLinks) {
			if (!link.includes('#')) link = setSlashes(link, false, this.addTrailingSlash);

			links.add(link);
			return link;
		}
		return undefined;
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
		relative_path = basePath === '' ? relative_path : path.join(basePath, relative_path).replace(/\\/g, '/');

		// Slugify the path, keeping slashes
		relative_path = slugifyPath(relative_path);

		// Remove index from the end of the path
		return resolveIndex(relative_path);
	}

	/**
	 * Get the link path for a given file path, considering explicit slug associations
	 * @param filePath - The file path to get the link path for
	 * @param folderPath - The base path to resolve the relative path
	 */
	private getLinkPathFromFilePath(filePath: string, folderPath: string) {
		// Path of built file is structured as `dist/A/B/index.html` where `A/B` is the slug of the page
		let linkPath = this.explicitSlugAssociations.get(filePath);
		if (!linkPath) {
			linkPath = path.join(this.basePath, this.getLinkPath(filePath.slice(0, -5), folderPath, '')).replace(/\\/g, '/');
			if (linkPath === '.') {
				linkPath = '';
			}
			linkPath = setSlashes(linkPath, true, this.addTrailingSlash);
		}

		return linkPath;
	}
}
