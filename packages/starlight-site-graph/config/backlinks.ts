import { z } from 'astro/zod';

export const globalBacklinksConfig = {
	visibilityRules: ['**/*'],
}

export const globalBacklinksConfigSchema = z.object({
	/**
	 * Configure the visibility of the backlinks component in the sidebar with an ordered list of rules.
	 * The backlinks are hidden/shown if the page's _slug_ matches one of the rules.
	 * When a rule starts with `!`, the backlinks are _hidden_ if matched.
	 * Rules are evaluated in order, the first matching rule determines the visibility of the page.
	 * If visibility of the backlinks was specified in the page frontmatter, it will take precedence over these rules.
	 *
	 * @default Backlinks are visible for all pages
	 * ["**\/*"]
	 * @example Only show backlinks for pages in the "api" folder:
	 * ["api/**"]
	 * @example Show backlinks for all pages except those in the "secret" folder:
	 * ["!secret/**", "**\/*"]
	 * @see https://github.com/mrmlnc/fast-glob#basic-syntax
	 */
	visibilityRules: z.array(z.string()).default(globalBacklinksConfig.visibilityRules),
}).partial();

export type BacklinksConfig = z.infer<typeof globalBacklinksConfigSchema>;
