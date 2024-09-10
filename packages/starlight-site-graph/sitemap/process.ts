import { ensureLeadingPound, firstMatchingPattern } from './util';
import type { NodeStyle, Sitemap, StarlightSiteGraphConfig } from '../config';

/**
 * Ensure that the passed sitemap is valid and has all rules applied to it
 */
export function processSitemap(sitemap: Sitemap, options: StarlightSiteGraphConfig) {
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

	return sitemap;
}
