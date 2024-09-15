interface Node {
	exists: boolean;
	title: string;
	links?: string[];
	backlinks?: string[];
	nodeStyle?: object;
}

interface NodeConfig {
	name: string;
	config?: object;
	links?: string[];
	backlinks?: string[];
}

interface RandomConfig extends NodeConfig {
	connectPct?: number;
}

export function generateSitemap(nodes: NodeConfig[]) {
	const sitemap: Record<string, Node> = {};
	nodes.forEach(({ name, config, links, backlinks }) => {
		sitemap[name + "/"] = {
			exists: true,
			title: name.charAt(0).toUpperCase() + name.slice(1),
			nodeStyle: config ?? undefined,
			links,
			backlinks
		}
	});
	return sitemap;
}

export function randomlyLinkNodes(nodes: RandomConfig[], defaultConnectPct: number = 0.2) {
	const sitemap: Record<string, Node> = {};
	nodes.forEach(({ name, config, links, backlinks, connectPct }) => {
		const randomLinks = nodes
			.filter((link) => Math.random() < (connectPct ?? defaultConnectPct) && link.name !== name)
			.map(({ name }) => name + "/");
		sitemap[name + "/"] = {
			exists: true,
			title: name.charAt(0).toUpperCase() + name.slice(1),
			nodeStyle: config ?? undefined,
			links: [...new Set([...(links ?? []), ...randomLinks])],
			backlinks
		}
	});
	return sitemap;
}
