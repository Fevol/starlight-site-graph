import micromatch from 'micromatch';

interface Node {
	exists?: boolean;
	external?: boolean;
	title?: string;
	links?: string[];
	tags?: string[];
	backlinks?: string[];
	nodeStyle?: object;
}

interface NodeConfig extends Node {
	id: string;
}

interface RandomConfig extends NodeConfig {
	connectPct?: number;
}

export function convertToSitemap(nodes: NodeConfig[]) {
	return Object.fromEntries(nodes.map(({ id, ...node }) => [id, node]));
}

export function generateSitemap(nodes: NodeConfig[]) {
	return convertToSitemap(enforceValidNodes(nodes));
}

export function overrideConfig(baseConfig: any, overrideConfig: any) {
	return {
		graphConfig: {
			...baseConfig.graphConfig,
			...overrideConfig.graphConfig,
		},
		sitemapConfig: {
			...baseConfig.sitemapConfig,
			...overrideConfig.sitemapConfig,
		},
		backlinksConfig: {
			...baseConfig.backlinksConfig,
			...overrideConfig.backlinksConfig,
		}
	}
}

function setSlashes(path: string, leading: boolean = true, trailing: boolean = true) {
	if (leading) {
		path = (path.startsWith('/') || path.startsWith("http")) ? path : `/${path}`;
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

export function enforceValidNodes(nodes: NodeConfig[]) {
	for (const node of nodes) {
		node.id = setSlashes(node.id);
		node.title ??= node.id
			.slice(1, -1)
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
		node.exists ??= true;
		node.links = (node.links ?? []).map((link) => setSlashes(link));
		node.backlinks = (node.backlinks ?? []).map((link) => setSlashes(link));
	}

	for (const node of nodes) {
		for (const link of node.links!) {
			nodes.find((n) => n.id === link)?.backlinks?.push(node.id);
		}
	}

	// EXPL: Cannot be moved into the loop above, as backlinks need to be fully populated first
	for (const node of nodes) {
		node.links = node.links?.length ? [...new Set(node.links)] : undefined;
		node.backlinks = node.backlinks?.length ? [...new Set(node.backlinks)] : undefined;
	}

	return nodes;
}


export function generateRandomSitemap(nodes: RandomConfig[], size: number, connectPct: number = 0.2, unresolvedPct: number = 0.1, externalPct: number = 0.1, connectToFirstPct: number = 0.0) {
	const all_nodes = [...nodes, ...generateRandomNodes(size, connectPct, unresolvedPct, externalPct)];
	if (connectToFirstPct > 0) {
		for (const node of all_nodes) {
			if (Math.random() < connectToFirstPct && node.id !== all_nodes[0].id && !node.external) {
				node.links = [...new Set([...(node.links ?? []), all_nodes[0].id])];
			}
		}
	}
	return generateSitemap(randomlyLinkNodes(all_nodes, connectPct));
}

export function generateRandomNodes(size: number, connectPct: number = 0.2, unresolvedPct: number = 0.1, externalPct: number = 0.1): RandomConfig[] {
	return Array.from({ length: size }, (_, i) => {
		const randExists = !(Math.random() < unresolvedPct);
		const randExternal = Math.random() < externalPct;
		return {
			id: `/node-${i + 1}/`,
			exists: randExists,
			external: randExternal,
			connectPct: connectPct,
		}
	});
}

export function randomlyLinkNodes(nodes: RandomConfig[], defaultConnectPct: number = 0.2): NodeConfig[] {
	for (const node of nodes) {
		if (node.external) {
			node.links = [];
			node.connectPct = undefined;
			continue;
		}

		const randomLinks = nodes
			.filter((link) => Math.random() < (node.connectPct ?? defaultConnectPct) && link.id !== node.id)
			.map(({ id }) => id);
		node.links = [...new Set([...(node.links ?? []), ...randomLinks])];
		node.connectPct = undefined;
	}
	return nodes;
}

export function renameNodes(sitemap: Record<string, NodeConfig>, renames: Record<string, string>) {
	const sitemapCopy = structuredClone(sitemap);
	for (const [id, newName] of Object.entries(renames)) {
		if (sitemapCopy[id]) {
			sitemapCopy[id].title = newName;
		}
	}
	return sitemapCopy;
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

export function restyleNodes(sitemap: Record<string, NodeConfig>, styles: Map<string[], object>) {
	const sitemapCopy = structuredClone(sitemap);
	for (const [rules, style] of styles) {
		for (const [id, node] of Object.entries(sitemapCopy)) {
			if (firstMatchingPattern(id, rules)) {
				node.nodeStyle = { ...node.nodeStyle, ...style };
			}
		}
	}
	return sitemapCopy;
}

export function addTags(sitemap: Record<string, NodeConfig>, tags: Record<string, string[]>) {
	const sitemapCopy = structuredClone(sitemap);
	for (const [tag, rules] of Object.entries(tags)) {
		for (const [id, node] of Object.entries(sitemapCopy)) {
			if (firstMatchingPattern(id, rules)) {
				node.tags = [...new Set([...(node.tags ?? []), tag])];
			}
		}
	}
	return sitemapCopy;
}
