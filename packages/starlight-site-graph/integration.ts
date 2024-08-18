import { addVirtualImports, defineIntegration } from 'astro-integration-kit';
import { starlightSiteGraphConfigSchema } from './config';
import matter from 'gray-matter';

import fs from 'node:fs';
import path from 'node:path';
import { ensureTrailingSlash, fileExists, resolveIndex, slugifyPath, stripLeadingSlash } from './integrationUtil';
import type { Sitemap } from './types';

async function* walk(dir: string): AsyncGenerator<string> {
	for await (const d of await fs.promises.opendir(dir)) {
		const entry = path.join(dir, d.name);
		if (d.isDirectory()) yield* walk(entry);
		else if (d.isFile()) yield entry;
	}
}

function siteMapDict() {
	const handler = {
		get: function (target: Sitemap, key: string) {
			if (!(key in target)) {
				const path = key.toString(); // Assuming the key is the path
				target[key] = {
					exists: false,
					title: path.split('/').pop()!,
					content: '',
					links: [],
					backlinks: [],
					tags: [],
				};
			}
			return target[key];
		},
	};
	return new Proxy({}, handler);
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
					if (!options.sitemap) {
						params.logger.info('Generating sitemap from content links');
						const sitemap = siteMapDict();
						for await (const p of walk(options.contentRoot)) {
							if (!(p.endsWith('.md') || p.endsWith('.mdx'))) continue;

							const content = await fs.promises.readFile(p, 'utf8');
							const links = content.match(/\[.*?]\((.*?)\)/g);

							// we get the relative path and then remove the extension
							let relative_path = path
								.relative(options.contentRoot, p)
								.replace(/\\/g, '/')
								.split('.')
								.slice(0, -1)
								.join('.');
							// make sure the slashes are correct and honor the base option
							relative_path = ensureTrailingSlash(
								params.config.base === '/'
									? stripLeadingSlash(relative_path)
									: path.join(stripLeadingSlash(params.config.base), relative_path),
							);

							// slugify the path, keeping slashes
							relative_path = slugifyPath(relative_path);

							// remove index from the end of the path
							relative_path = resolveIndex(relative_path);

							const sitemap_entry = sitemap[relative_path]!;

							const frontmatter: { data: { title?: string; links?: string[] } } = matter(content);
							if (frontmatter.data) {
								sitemap_entry.title = frontmatter.data.title ?? relative_path.split('/').pop()!;
								sitemap_entry.links = frontmatter.data.links ?? [];
							} else {
								sitemap_entry.title ??= relative_path.split('/').pop()!;
							}

							if (links) {
								// FIXME: Catch links that are not formatted as [text](link)
								sitemap_entry.links = [
									...new Set([
										...sitemap_entry.links,
										...links
											.reduce((acc: string[], link: string) => {
												const url = link.match(/\((.*?)\)/)![1]!;

												if (!url.startsWith('http')) {
													// remove the leading slash
													acc.push(url.slice(1));
												}
												return acc;
											}, [])
											.map((link: string) => {
												// resolve relative links
												if (link.startsWith('.')) {
													link = path.join(relative_path, link);
												}

												// Remove the hash and everything after it
												return ensureTrailingSlash(link.split('#')[0]!);
											})
											.filter(link => link !== relative_path),
									]),
								];

								for (const link of sitemap_entry.links) sitemap[link]!.backlinks.push(relative_path);
							}
							sitemap[relative_path] = sitemap_entry;
						}

						for (const entry of Object.keys(sitemap)) {
							const sitemap_entry = sitemap[entry]!;
							sitemap_entry.backlinks = [...new Set(sitemap_entry.backlinks)];
							const file_path = path.join(options.contentRoot, entry);
							const found_file = await fileExists(path.dirname(file_path), path.basename(file_path));
							sitemap_entry.exists = found_file !== null;

							sitemap[entry] = sitemap_entry;
						}

						options.sitemap = { ...sitemap };
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
