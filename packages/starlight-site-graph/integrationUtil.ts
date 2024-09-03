import fs from 'node:fs';
import path from 'node:path';
import micromatch from 'micromatch';

export function slugifyPath(path: string) {
	return (
		path
			// remove leading & trailing whitespace
			.trim()
			// remove special characters
			.replace(/[^A-Za-z0-9 /-]/g, '')
			// replace spaces
			.replace(/\s+/g, '-')
			// output lowercase
			.toLowerCase()
	);
}

export function resolveIndex(path: string) {
	return path.endsWith('index') ? path.slice(0, -5) : path;
}

export function ensureLeadingSlash(path: string): string {
	return path.startsWith('/') ? path : `/${path}`;
}

export function ensureTrailingSlash(path: string): string {
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

export function firstMatchingPattern(text: string, patterns: string | string[], defaultMatch?: boolean): boolean | undefined {
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
