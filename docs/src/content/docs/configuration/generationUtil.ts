interface Node {
	exists?: boolean;
	external?: boolean;
	title?: string;
	links?: string[];
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

export function enforceValidNodes(nodes: NodeConfig[]) {
	for (const node of nodes) {
		node.id = node.id.endsWith('/') ? node.id : `${node.id}/`;
		node.title ??= node.id.slice(0, -1).split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
		node.exists ??= true;
		node.links = node.links ? node.links.map((link) => link.endsWith('/') ? link : `${link}/`) : [];
		node.backlinks = node.backlinks ? node.backlinks.map((link) => link.endsWith('/') ? link : `${link}/`) : [];
	}

	// Yes this is inefficient, too bad! (Okay, I'm just trying to get all of this finished by the evening)
	for (const node of nodes) {
		for (const link of node.links!) {
			const linkedNode = nodes.find((n) => n.id === link);
			linkedNode?.backlinks?.push(node.id);
		}
	}

	for (const node of nodes) {
		node.links = [...new Set(node.links)];
		node.backlinks = [...new Set(node.backlinks)];
	}

	return nodes;
}


export function generateRandomSitemap(nodes: RandomConfig[], size: number, connectPct: number = 0.2, unresolvedPct: number = 0.1, externalPct: number = 0.1) {
	const all_nodes = [...nodes, ...generateRandomNodes(size, connectPct, unresolvedPct, externalPct)];
	return generateSitemap(randomlyLinkNodes(all_nodes, connectPct));
}

export function generateRandomNodes(size: number, connectPct: number = 0.2, unresolvedPct: number = 0.1, externalPct: number = 0.1): RandomConfig[] {
	return Array.from({ length: size }, (_, i) => {
		const randExists = !(Math.random() < unresolvedPct);
		const randExternal = Math.random() < externalPct;
		return {
			id: `node-${i + 1}/`,
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
