import fs from 'node:fs';
import path from 'node:path';
import micromatch from 'micromatch';

export function slugifyPath(path: string) {
	return (
		path
			// Remove leading & trailing whitespace
			.trim()
			// Remove special characters
			.replace(/[^A-Za-z0-9 /-]/g, '')
			// Replace spaces
			.replace(/\s+/g, '-')
			.toLowerCase()
	);
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
		if (micromatch.isMatch(text, pattern.startsWith('!') ? pattern.slice(1) : pattern)) {
			return !pattern.startsWith('!');
		}
	}
	return defaultMatch;
}

// FIXME: The filename passed in here might be slugified, the only way seems to also slugify the names of the files in the directory
export async function fileExists(directory: string, fileName: string): Promise<string | null> {
	try {
		if (!fs.existsSync(directory)) {
			return Promise.resolve(null);
		}
		const files = await fs.promises.readdir(directory);
		const file = files.find(file_1 => file_1.startsWith(fileName));
		return file ? path.join(directory, file) : null;
	} catch (e) {
		return Promise.resolve(null);
	}
}

export async function* walk(dir: string): AsyncGenerator<string> {
	for await (const d of await fs.promises.opendir(dir)) {
		const entry = path.join(dir, d.name);
		if (d.isDirectory()) yield* walk(entry);
		else if (d.isFile()) yield entry;
	}
}

export function extractInnerText(tag: string) {
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
