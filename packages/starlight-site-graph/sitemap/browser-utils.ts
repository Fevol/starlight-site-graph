import picomatch from 'picomatch';
import { slug } from "github-slugger"

export function slugifyPath(path: string) {
	// Properly encode unicode for URLs
	return encodeURI(path
		.split('/')
		.map((segment) => slug(segment))
		.join('/'));
}


export function resolveIndex(path: string) {
	if (path.endsWith('/')) path = path.slice(0, -1);
	return path.endsWith('index') ? path.slice(0, -5) : path;
}

export function ensureLeadingSlash(path: string): string {
	return path.startsWith('/') ? path : `/${path}`;
}

export function ensureTrailingSlash(path: string, add: boolean): string {
	if (!add) return path.endsWith('/') ? path.slice(0, -1) : path;
	return path.endsWith('/') ? path : `${path}/`;
}

export function ensureLeadingPound(path: string): string {
	return path.startsWith('#') ? path : `#${path}`;
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

export function trimSlashes(path: string) {
	while (path.startsWith('/')) path = path.slice(1);
	while (path.endsWith('/')) path = path.slice(0, -1);
	return path;
}

export function onlyTrailingSlash(path: string, add: boolean) {
	return ensureTrailingSlash(stripLeadingSlash(path), add);
}

export function firstMatchingPattern(
	text: string,
	patterns: string | string[],
	defaultMatch?: boolean,
): boolean | undefined {
	const patternList = typeof patterns === 'string' ? [patterns] : patterns;
	for (const pattern of patternList) {
		if (picomatch.isMatch(text, pattern.startsWith('!') ? pattern.slice(1) : pattern)) {
			return !pattern.startsWith('!');
		}
	}
	return defaultMatch;
}

export function extractMDLinkText(link: string): string {
	const match = link.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
	// Remove markdown formatting characters like *, _, `, ~
	return match![1]!.replace(/[*_`~]/g, '').trim();
}

export function extractHTMLInnerText(tag: string) {
	return tag.replace(/<[^>]*>/g, '').trim();
}

export function getMostCommonItem<T>(arr: T[]): T | undefined {
	if (arr.length === 0) return undefined;
	const counts = new Map<T, number>();
	for (const item of arr) {
		counts.set(item, (counts.get(item) ?? 0) + 1);
	}
	return [...counts.entries()].reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}
