import picomatch from 'picomatch';

export function endsWith(path: string, suffix: string): boolean {
	return path === suffix || path.endsWith('/' + suffix);
}

export function trimSuffix(path: string, suffix: string): string {
	if (endsWith(path, suffix)) path = path.slice(0, -suffix.length);
	return path;
}

export function ensureLeadingSlash(path: string): string {
	return path.startsWith('/') ? path : `/${path}`;
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
		path = path.endsWith('/') && path.length !== 1 ? path.slice(0, -1) : path;
	}

	return path;
}

export function simplifySlug(path: string, trailingSlash: boolean): string {
	// TODO: Figure out why 'index' was added
	return setSlashes(trimSuffix(path, 'index'), true, trailingSlash);
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
