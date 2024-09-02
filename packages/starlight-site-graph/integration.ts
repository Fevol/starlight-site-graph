import fs from 'node:fs';
import path from 'node:path';

import { addVirtualImports, defineIntegration } from 'astro-integration-kit';
import matter from 'gray-matter';

import { starlightSiteGraphConfigSchema } from './config';
import { ensureTrailingSlash, resolveIndex, slugifyPath, stripLeadingSlash, trimSlashes, firstMatchingPattern } from './integrationUtil';
import type { Sitemap, SitemapEntry } from './types';
import type {PageConfig} from "./schema";

async function* walk(dir: string): AsyncGenerator<string> {
	for await (const d of await fs.promises.opendir(dir)) {
		const entry = path.join(dir, d.name);
		if (d.isDirectory()) yield* walk(entry);
		else if (d.isFile()) yield entry;
	}
}

interface IntermediateSitemapEntry {
	filePath: string | undefined;
	linkPath: string;
	title: string;
	tags: Set<string>;
	links: Set<string>;
	backlinks: Set<string>;
}

class SiteMapBuilder {
	map: Map<string, IntermediateSitemapEntry>;
	contentRoot: string;
	basePath: string;
	globalLinkRules: string[];

	constructor(contentRoot: string, basePath: string, excludedLinkRules: string[] = []) {
		this.map = new Map();
		this.contentRoot = trimSlashes(contentRoot);
		this.basePath = trimSlashes(basePath);
		this.globalLinkRules = excludedLinkRules;
	}

	async add(filePath: string) {
		const extname = path.extname(filePath);
		if (extname !== '.md' && extname !== '.mdx') return;

		const content = await fs.promises.readFile(filePath, 'utf8');
		// FIXME: Catch links that are not formatted as [text](link)
		const linkMatches = content.match(/\[.*?]\((.*?)\)/g);

		const linkPath = this.getLinkPath(filePath);

		let title = path.basename(linkPath, extname);
		let links = new Set<string>();
		const tags = new Set<string>();

		const frontmatter = matter(content) as unknown as { data: PageConfig };

		if (linkMatches) {
			for (const match of linkMatches) {
				let link = match.match(/\((.*?)\)/)![1]!;

				// FIXME: better detection of external links
				if (link.startsWith('http')) continue;

				// remove the leading slash
				link = link.slice(1);

				if (link.startsWith('.')) {
					link = path.join(linkPath, link);
				}

				link = ensureTrailingSlash(link.split('#')[0]!);

				if (link !== linkPath) {
					links.add(link);
				}
			}
		}

		if (frontmatter.data) {
			if (frontmatter.data.sitemap?.include === false) {
				return;
			}

			title = frontmatter.data.title ?? title;
		}

		const currentLinkRules = (frontmatter.data?.sitemap?.linkInclusionRules ?? []).concat(this.globalLinkRules);
		if (currentLinkRules.length) {
			links = new Set([...links].filter(link => firstMatchingPattern(link, currentLinkRules, false)));
		}

		if (frontmatter.data) {
			if (frontmatter.data.links) {
				for (const link of [].concat(frontmatter.data.links)) {
					links.add(link);
				}
			}

			if (frontmatter.data.tags) {
				for (const tag of [].concat(frontmatter.data.tags)) {
					tags.add(tag);
				}
			}
		}


		this.map.set(linkPath, {
			filePath,
			linkPath,
			title,
			tags,
			links,
			backlinks: new Set<string>(),
		});
	}

	process() {
		// add all links that are not in the map
		// these are the unresolved links
		for (const [_, entry] of this.map) {
			for (const link of entry.links) {
				if (!this.map.has(link)) {
					this.map.set(link, {
						filePath: undefined,
						linkPath: link,
						title: path.basename(link),
						tags: new Set(),
						links: new Set(),
						backlinks: new Set(),
					});
				}
			}
		}

		// calculate backlinks for each entry
		for (const [_, entry] of this.map) {
			for (const link of entry.links) {
				this.map.get(link)!.backlinks.add(entry.linkPath);
			}
		}
	}

	toSitemap(): Sitemap {
		const sitemap: Sitemap = {};

		for (const [_, entry] of this.map) {
			const sitemapEntry: SitemapEntry = {
				exists: entry.filePath !== undefined,
				title: entry.title,
				tags: [...entry.tags],
				links: [...entry.links],
				backlinks: [...entry.backlinks],
			};

			sitemap[entry.linkPath] = sitemapEntry;
		}

		return sitemap;
	}

	private getLinkPath(filePath: string) {
		// we get the relative path and then remove the extension
		let relative_path = path
			.relative(this.contentRoot, filePath)
			.replace(/\\/g, '/')
			.split('.')
			.slice(0, -1)
			.join('.');
		// make sure the slashes are correct and honor the base option
		relative_path = ensureTrailingSlash(
			this.basePath === '' ? stripLeadingSlash(relative_path) : path.join(this.basePath, relative_path),
		);

		// slugify the path, keeping slashes
		relative_path = slugifyPath(relative_path);

		// remove index from the end of the path
		return resolveIndex(relative_path);
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
		return {
			hooks: {
				'astro:config:setup': async params => {
					const { sitemapConfig } = options;
					if (!options.sitemapConfig.sitemap) {
						params.logger.info(
							'Generating sitemap from content links' +
								(sitemapConfig.pageInclusionRules.length
									? ` (with patterns ${sitemapConfig.pageInclusionRules.join(', ')})`
									: ''),
						);

						const builder = new SiteMapBuilder(sitemapConfig.contentRoot, params.config.base, sitemapConfig.pageInclusionRules);
						for await (const p of walk(sitemapConfig.contentRoot)) {
							if (firstMatchingPattern(p, sitemapConfig.pageInclusionRules, false)) {
								await builder.add(p);
							}
						}

						builder.process();
						const sitemap = builder.toSitemap();

						options.sitemapConfig.sitemap = { ...sitemap };
						params.logger.info('Finished generating sitemap');
					} else {
						params.logger.info('Using applied sitemap');
					}

					addVirtualImports(params, {
						name,
						imports: {
							'virtual:starlight-site-graph/config': `export default ${JSON.stringify(options)}`,
						},
					});
				},
			},
		};
	},
});
