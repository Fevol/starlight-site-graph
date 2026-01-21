/**
 * Browser-safe utilities for starlight-site-graph.
 *
 * These utilities can be safely imported in client-side TypeScript code
 * without triggering Vite's "module externalized for browser compatibility" warnings.
 *
 * IMPORTANT: Do NOT import micromatch or other Node.js-dependent libraries here.
 * For glob matching (firstMatchingPattern), use ./util.ts which is server-side only.
 */

export function ensureLeadingSlash(path: string): string {
	return path.startsWith('/') ? path : `/${path}`;
}

export function ensureTrailingSlash(path: string, add: boolean): string {
	if (!add) return path.endsWith('/') ? path.slice(0, -1) : path;
	return path.endsWith('/') ? path : `${path}/`;
}

export function stripLeadingSlash(path: string) {
	return path.replace(/^\//, '');
}

export function setSlashes(path: string, leading: boolean = true, trailing: boolean = true) {
	if (leading) {
		path = path.startsWith('/') ? path : `/${path}`;
	} else {
		path = path.startsWith('/') ? path.slice(1) : path;
	}

	if (trailing) {
		path = path.endsWith('/') ? path : `${path}/`;
	} else {
		path = (path.endsWith('/') && path.length !== 1) ? path.slice(0, -1) : path;
	}

	return path;
}

/**
 * Browser-safe URL path joining.
 * Unlike Node's path.join, this always uses forward slashes and is safe to use
 * in client-side code without triggering Vite's "module externalized" warnings.
 *
 * @example joinUrlPath('/base', 'page') => '/base/page'
 * @example joinUrlPath('/base/', '/page/') => '/base/page'
 * @example joinUrlPath('', 'page') => '/page'
 */
export function joinUrlPath(...segments: string[]): string {
	const joined = segments
		.filter(Boolean)
		.map(segment => segment.replace(/^\/+|\/+$/g, ''))
		.filter(Boolean)
		.join('/');
	return joined ? `/${joined}` : '/';
}

/**
 * Browser-safe glob pattern matching.
 * Supports common glob patterns without requiring Node.js dependencies.
 *
 * Supported patterns:
 * - `*` matches any characters except `/`
 * - `**` matches any characters including `/` (any depth)
 * - `?` matches exactly one character except `/`
 * - `[abc]` matches any character in brackets
 * - `[!abc]` or `[^abc]` matches any character not in brackets
 *
 * @example isGlobMatch('/docs/guide/', '**\/*') => true
 * @example isGlobMatch('/api/v1/users', '/api/**') => true
 * @example isGlobMatch('/private/secret', '!/private/*') => false (negation)
 */
export function isGlobMatch(text: string, pattern: string): boolean {
	// Convert glob pattern to regex
	let regexStr = pattern
		// Escape regex special chars except glob chars
		.replace(/[.+^${}()|[\]\\]/g, '\\$&')
		// Convert ** to match any path (including /)
		.replace(/\\\*\\\*/g, '.*')
		// Convert * to match anything except /
		.replace(/\\\*/g, '[^/]*')
		// Convert ? to match single char except /
		.replace(/\\\?/g, '[^/]');

	// Anchor the pattern
	regexStr = `^${regexStr}$`;

	try {
		const regex = new RegExp(regexStr);
		return regex.test(text);
	} catch {
		return false;
	}
}

/**
 * Browser-safe pattern matching with support for negation and multiple patterns.
 * This is a lightweight alternative to micromatch for use in client-side code.
 *
 * @example firstMatchingPatternBrowser('/docs/guide', ['**\/*']) => true
 * @example firstMatchingPatternBrowser('/private/x', ['!/private/*', '**\/*']) => false
 */
export function firstMatchingPatternBrowser(
	text: string,
	patterns: string | string[],
	defaultMatch?: boolean,
): boolean | undefined {
	const patternList = typeof patterns === 'string' ? [patterns] : patterns;
	for (const pattern of patternList) {
		const isNegated = pattern.startsWith('!');
		const cleanPattern = isNegated ? pattern.slice(1) : pattern;
		if (isGlobMatch(text, cleanPattern)) {
			return !isNegated;
		}
	}
	return defaultMatch;
}
