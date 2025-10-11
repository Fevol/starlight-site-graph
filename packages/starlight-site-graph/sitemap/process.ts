import { ensureLeadingPound, firstMatchingPattern } from './util';
import type { FullStarlightSiteGraphConfig, NodeStyle, RemoveOptional, Sitemap } from '../config';

/**
 * Ensure that the passed sitemap is valid and has all rules applied to it
 */
export function processSitemap(sitemap: RemoveOptional<Sitemap>, options: FullStarlightSiteGraphConfig) {
	for (const [linkPath, entry] of Object.entries(sitemap)) {
		const tags = new Set<string>(entry.tags);
		for (const [tag, tagRules] of Object.entries(options.sitemapConfig.tagRules)) {
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
					...(style as NodeStyle),
					...nodeStyle,
				};
			}
		}

		// @ts-expect-error shapeColor cannot be correctly casted
		entry.nodeStyle = {
			...entry.nodeStyle,
			...nodeStyle,
		};
	}

	return sitemap;
}
