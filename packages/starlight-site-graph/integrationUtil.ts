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

export function stripLeadingSlash(path: string) {
	return path.replace(/^\//, '');
}
