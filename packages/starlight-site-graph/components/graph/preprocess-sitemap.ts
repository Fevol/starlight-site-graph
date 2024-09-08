import type { LinkData, NodeData } from './types';
import type { Sitemap } from '../../types';
import { getVisitedEndpoints, simplifySlug } from '../util';
import type { GraphConfig, NodeStyle } from '../../config';
import { DEFAULT_CORNER_RADIUS, DEFAULT_POLYGON_POINTS, DEFAULT_STAR_POINTS, DEFAULT_STROKE_WIDTH } from './constants';

interface GraphContext {
	config: GraphConfig;

	currentPage: string;
}


export type GraphData = {
	nodes: NodeData[];
	links: LinkData[];
};

export function processSitemapData(context: GraphContext, siteData: Sitemap): GraphData {
	const visitedPages: Set<string> = context.config.trackVisitedPages ? getVisitedEndpoints() : new Set();

	let slug = context.currentPage;

	const links: LinkData[] = [];
	const tags: Set<string> = new Set();

	let corrected_data = Object.entries(siteData)
		.map(([k, v]) => [simplifySlug(k), v] as const);
	if (!context.config.renderUnresolved) {
		corrected_data = corrected_data.filter(([_, v]) => v.exists);
	}
	const data = new Map(corrected_data);

	let depth = context.config.depth;
	if (depth >= 5) depth = -1;

	const validLinks = new Set(data.keys());
	for (const [source, details] of data.entries()) {
		const outgoing = details.links ?? [];
		for (const dest of outgoing) {
			if (validLinks.has(dest)) {
				links.push({ source: source as unknown as NodeData, target: dest as unknown as NodeData });
			}
		}

		if (context.config.tagRenderMode === "node" || context.config.tagRenderMode === "both") {
			for (const tag of details.tags) {
				tags.add(tag);
				links.push({ source: source as unknown as NodeData, target: tag as unknown as NodeData });
			}
		}
	}

	const neighbourhood = new Set<string>();
	// __SENTINEL is used to separate levels in the BFS
	const queue: (string | '__SENTINEL')[] = [slug, '__SENTINEL'];

	if (depth !== -1) {
		while (depth >= 0 && queue.length > 0) {
			const current = queue.shift()!;

			if (current === '__SENTINEL') {
				depth -= 1;
				if (queue.length === 0) {
					break;
				}
				queue.push('__SENTINEL');
			} else if (neighbourhood.has(current)) {

			} else {
				neighbourhood.add(current);

				for (const l of links) {
					const source = l.source as unknown as string;
					const target = l.target as unknown as string;

					if (source === current) {
						queue.push(target);
					}
					if (target === current) {
						queue.push(source);
					}
				}
			}
		}
	} else {
		validLinks.forEach(id => neighbourhood.add(id));
		if (context.config.tagRenderMode === "node" || context.config.tagRenderMode === "both")  {
			tags.forEach(tag => neighbourhood.add(tag));
		}
	}

	const nodes: NodeData[] = [];
	for (const id of neighbourhood) {
		const node = data.get(id);
		if (!node) continue;

		const neighborCount = (node.links?.length ?? 0) + (node.backlinks?.length ?? 0);

		// Chain of declarations determines style priority
		let style: NodeStyle = context.config.nodeDefaultStyle as NodeStyle;
		if (visitedPages.has(id)) {
			style = {...style, ...context.config.nodeVisitedStyle as NodeStyle};
		}

		if (context.config.tagRenderMode === "same" || context.config.tagRenderMode === "both") {
			style = {...style, ...node.tags.reduce((acc, tag) => ({ ...acc, ...context.config.tagStyles[tag] }), {}) as NodeStyle};
		}

		if (id === context.currentPage) {
			style = {...style, ...context.config.nodeCurrentStyle as NodeStyle};
		}

		if (!node.exists) {
			style = {...style, ...context.config.nodeUnresolvedStyle as NodeStyle};
		}

		style = {...style, ...node.nodeStyle as NodeStyle};

		if (style.strokeColor) {
			style.strokeWidth = Math.max(DEFAULT_STROKE_WIDTH, style.strokeWidth);
		} else if (style.strokeWidth) {
			style.strokeColor = 'inherit';
		}

		if (style.shapeRotation === 'random') {
			style.shapeRotation = Math.random() * Math.PI * 2;
		} else {
			style.shapeRotation = (style.shapeRotation ?? 0) * Math.PI / 180;
		}

		if (style.shape === "star") {
			style.shapePoints ??= DEFAULT_STAR_POINTS;
		} else if (style.shape === "polygon") {
			style.shapePoints ??= DEFAULT_POLYGON_POINTS;
		} else if (style.shape === "square") {
			style.shapePoints = 4;
			style.shape = "polygon";
			// Ensures that square (and triangle) is upright at 0 degrees shapeRotation
			style.shapeRotation += Math.PI / 4;
		} else if (style.shape === "triangle") {
			style.shapePoints = 3;
			style.shape = "polygon";
			style.shapeRotation -= Math.PI / 2;
		}

		if (style.cornerType) {
			style.shapeCornerRadius = Math.min(style.shapeSize, style.shapeCornerRadius ?? DEFAULT_CORNER_RADIUS);
			style.strokeCornerRadius = Math.min(style.strokeWidth, style.strokeCornerRadius ?? DEFAULT_CORNER_RADIUS);
		} else {
			style.shapeCornerRadius = 0;
			style.strokeCornerRadius = 0;
		}

		// Magick radius calculations
		const scaleFactor = Math.max(0.00000001, (-9.67101 * 0.99868 ** neighborCount + 10.6354) ** style.neighborScale * style.nodeScale);
		const computedSize = style.shapeSize * scaleFactor, fullRadius = computedSize + style.strokeWidth / 2;

		nodes.push({
			id: id,
			exists: node.exists,
			text: node.title,
			tags: (node.tags ?? []),
			neighborCount,

			shape: style.shape,
			shapeSize: style.shapeSize,
			shapeColor: style.shapeColor,
			strokeWidth: style.strokeWidth,
			strokeColor: style.strokeColor,
			shapePoints: style.shapePoints,
			shapeRotation: style.shapeRotation,
			shapeCornerRadius: style.shapeCornerRadius,
			strokeCornerRadius: style.strokeCornerRadius,

			cornerType: style.cornerType,

			// TODO: computedSize may be removed if no use for it is found
			computedSize: computedSize,
			fullRadius: fullRadius,
			colliderSize: fullRadius * style.colliderScale,
		});
	}

	for (const tag of tags) {
		nodes.push({
			id: tag,
			exists: true,
			text: tag,
			tags: [tag],
			type: "tag",
			neighborCount: 1,

			...context.config.tagDefaultStyle,
			...context.config.tagStyles[tag] ?? {} as Partial<NodeStyle>,
		});
	}

	return {
		nodes,
		links: links.filter(
			l =>
				neighbourhood.has(l.source as unknown as string) &&
				neighbourhood.has(l.target as unknown as string),
		),
	};
}
