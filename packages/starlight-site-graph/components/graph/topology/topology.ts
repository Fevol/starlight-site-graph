import type { GraphData, LinkData, NodeData } from '../types';
import type { Graph } from '../graph';
import type { Sitemap } from '../config/types';
import type { NodeStyle } from '../config/types';


import { type GraphColorConfig, createGraphColorSources } from '../color';
import {
	collectGraphColors, computeNeighborSizeMultiplier, computeNodeSizes,
	getNodeDefaultStyle,
	createNodeVisualStates,
	resolveNodeStyle, resolveShapeCornerRadius,
	resolveStrokeCornerRadius, resolveTagStyle,
} from './style';

import { visitNodeStyleStates } from '../config/normalize';

import { firstMatchingPattern, simplifySlug } from '../shared/path';
import { isRecord } from '../shared/object';

import { FULL_GRAPH_DEPTH } from '../constants';

export function parseSitemap(serialized?: string): Sitemap {
	let parsed: unknown;
	try {
		parsed = JSON.parse(serialized || '{}');
	} catch (e) {
		console.error('[STARLIGHT-SITE-GRAPH] ' + (e instanceof Error ? e.message : e));
		return {};
	}

	if (!isRecord(parsed)) {
		return {};
	}

	const sitemap: Sitemap = {};
	for (const [key, value] of Object.entries(parsed)) {
		if (isRecord(value)) {
			const entry = value as Sitemap[string];
			visitNodeStyleStates(entry.nodeStyle, state => {
				if (state.shapeRotation === 'random') state.shapeRotation = Math.random() * 360;
			});
			sitemap[key] = entry;
		}
	}
	return sitemap;
}


function computeNodeDistances(
	context: Graph,
	data: Map<string, Sitemap[string]>,
	slug: string,
	validLinks: Set<string>,
): Map<string, number> {
	const nodeDistance = new Map<string, number>([[slug, 0]]);
	const queue: string[] = [slug];
	let cursor = 0;

	while (cursor < queue.length) {
		const current = queue[cursor++]!;
		const details = data.get(current);
		if (!details) {
			continue;
		}
		const currentDistance = nodeDistance.get(current)!;

		if (context.config.depthDirection === 'outgoing' || context.config.depthDirection === 'both') {
			for (const link of details.links ?? []) {
				if (validLinks.has(link) && !nodeDistance.has(link)) {
					nodeDistance.set(link, currentDistance + 1);
					queue.push(link);
				}
			}
		}

		if (context.config.depthDirection === 'incoming' || context.config.depthDirection === 'both') {
			for (const link of details.backlinks ?? []) {
				if (validLinks.has(link) && !nodeDistance.has(link)) {
					nodeDistance.set(link, currentDistance + 1);
					queue.push(link);
				}
			}
		}

		if (context.config.tagRenderMode === 'node' || context.config.tagRenderMode === 'both') {
			for (const tag of details.tags ?? []) {
				if (!nodeDistance.has(tag) || nodeDistance.get(tag)! > currentDistance) {
					nodeDistance.set(tag, currentDistance);
				}
			}
		}
	}

	return nodeDistance;
}

function buildNodeComputedData(context: Graph, style: NodeStyle, colors: GraphColorConfig, adjacentSize: number, distance?: number) {
	const sizeMultiplier = context.config.nodeSizeBy === 'neighbors'
		? computeNeighborSizeMultiplier(context, style, adjacentSize, distance)
		: 1;

	const { computedSize, fullRadius, colliderSize } = computeNodeSizes(style, sizeMultiplier);
	const shapeCornerRadius = resolveShapeCornerRadius(style, computedSize);
	const strokeCornerRadius = resolveStrokeCornerRadius(style);
	collectGraphColors(style, colors);
	const visualStates = createNodeVisualStates({ ...style, shapeCornerRadius, strokeCornerRadius });

	return { sizeMultiplier, computedSize, fullRadius, colliderSize, shapeCornerRadius, strokeCornerRadius, visualStates };
}

// TODO: Preprocess sitemap at build time and bundle together (client load performance vs. built page size)
export function processSitemapData(context: Graph, siteData: Sitemap, depthOverride?: number): GraphData {
	const slug = context.currentPage;
	let correctedData = Object.entries(siteData).map(([k, v]) =>
		[
			k.startsWith('http') || k.startsWith('mailto:') ? k : simplifySlug(k, context.trailingSlashes),
			v,
		] as const,
	);

	if (
		context.config.nodeInclusionRules &&
		(context.config.nodeInclusionRules.length > 1 || context.config.nodeInclusionRules[0] !== '**/*')
	) {
		correctedData = correctedData.filter(([k]) => firstMatchingPattern(k, context.config.nodeInclusionRules, true));
	}

	if (!context.config.renderUnresolved) {
		correctedData = correctedData.filter(([_, v]) => v.exists);
	}

	if (!context.config.renderExternal) {
		correctedData = correctedData.filter(([_, v]) => !v.external);
	}

	const data = new Map(correctedData);

	let depth = depthOverride ?? context.config.depth;
	if (depth >= FULL_GRAPH_DEPTH) {
		depth = -1;
	}

	let links: Array<{ source: string; target: string; key: string }> = [];
	const linkKeys = new Set<string>();
	const pushLink = (source: string, target: string) => {
		const key = `${source}->${target}`;
		if (!linkKeys.has(key)) {
			linkKeys.add(key);
			links.push({ source, target, key });
		}
	};
	const tags = new Set<string>();
	const validLinks = new Set(data.keys());
	const neighborhood = new Set<string>();
	const nodeDistance = computeNodeDistances(context, data, slug, validLinks);

	// NOTE: __SENTINEL is used to separate levels in the BFS
	const queue: (string | '__SENTINEL')[] = [slug, '__SENTINEL'];
	let cursor = 0;
	if (depth >= 0) {
		while (depth >= 0 && cursor < queue.length) {
			const current = queue[cursor++]!;
			if (current === '__SENTINEL') {
				depth -= 1;
				if (cursor >= queue.length) {
					break;
				}
				queue.push('__SENTINEL');
			} else if (!neighborhood.has(current)) {
				const node = data.get(current)!;
				// FIXME: This means that the target does not exist, link should have been removed
				//   NOTE 2: Depends on whether node is unresolved
				if (!node) {
					// console.error("[STARLIGHT-SITE-GRAPH] Node doesn't exist in sitemap:", current, data);
					continue;
				}

				neighborhood.add(current);
				if (context.config.depthDirection === 'outgoing' || context.config.depthDirection === 'both') {
					for (const link of node.links ?? []) {
						if (validLinks.has(link)) {
							pushLink(current, link);
						}
						queue.push(link);
					}
				}

				if (context.config.depthDirection === 'incoming' || context.config.depthDirection === 'both') {
					for (const link of node.backlinks ?? []) {
						if (validLinks.has(link)) {
							pushLink(link, current);
						}
						queue.push(link);
					}
				}

				if (context.config.tagRenderMode === 'node' || context.config.tagRenderMode === 'both') {
					for (const tag of node.tags ?? []) {
						neighborhood.add(tag);
						tags.add(tag);
						pushLink(current, tag);
					}
				}
			}
		}
	} else {
		for (const [source, details] of data.entries()) {
			neighborhood.add(source);
			for (const link of details.links ?? []) {
				if (validLinks.has(link)) {
					pushLink(source, link);
				}
			}

			if (context.config.tagRenderMode === 'node' || context.config.tagRenderMode === 'both') {
				for (const tag of details.tags ?? []) {
					neighborhood.add(tag);
					tags.add(tag);
					pushLink(source, tag);
				}
			}
		}
	}

	links = links.filter(link => neighborhood.has(link.source) && neighborhood.has(link.target));
	const adjacencyById = new Map<string, Set<string>>();
	const addAdjacent = (source: string, target: string) => {
		if (!adjacencyById.has(source)) {
			adjacencyById.set(source, new Set());
		}
		adjacencyById.get(source)!.add(target);
	};
	for (const { source, target } of links) {
		addAdjacent(source, target);
		addAdjacent(target, source);
	}

	const nodes: NodeData[] = [];
	const colors = createGraphColorSources();

	for (const id of neighborhood) {
		const node = data.get(id);
		if (!node) {
			continue;
		}

		const adjacent = new Set(adjacencyById.get(id) ?? []);
		const style = resolveNodeStyle(context, id, { ...node, tags: node.tags ?? [], visited: node.visited ?? false });
		const computed = buildNodeComputedData(context, style, colors, adjacent.size, nodeDistance.get(id));

		nodes.push({
			id: id,
			exists: node.exists,
			external: node.external,
			text: node.title,
			tags: node.tags ?? [],
			adjacent,
			visibleInGraph: true,
			...(nodeDistance.has(id) ? { depthDistance: nodeDistance.get(id)! } : {}),

			shape: style.shape,
			shapeSize: style.shapeSize,
			shapeColor: style.shapeColor,
			strokeWidth: style.strokeWidth,
			strokeColor: style.strokeColor,
			shapePoints: style.shapePoints,
			shapeRotation: style.shapeRotation,
			labelOffset: style.labelOffset,
			labelOpacity: style.labelOpacity,
			labelColor: style.labelColor,
			labelScale: style.labelScale,
			colliderScale: style.colliderScale,
			nodeScale: style.nodeScale,
			sizingStrength: style.sizingStrength,
			cornerType: style.cornerType,

			...computed,
		});
	}

	for (const tag of tags) {
		const tagStyle = resolveTagStyle(context, tag);
		const tagDefaultStyle = getNodeDefaultStyle(tagStyle);
		const adjacent = new Set(adjacencyById.get(tag) ?? []);
		const computed = buildNodeComputedData(context, tagStyle, colors, adjacent.size, nodeDistance.get(tag));

		nodes.push({
			id: tag,
			exists: true,
			external: false,
			text: tag,
			tags: [tag],
			type: 'tag',
			adjacent,
			visibleInGraph: true,
			...(nodeDistance.has(tag) ? { depthDistance: nodeDistance.get(tag)! } : {}),

			...tagDefaultStyle,
			...computed,
		});
	}

	return {
		nodes,
		links: links.map(link => {
			const sourceDistance = nodeDistance.get(link.source);
			const targetDistance = nodeDistance.get(link.target);
			return {
				...link,
				depthDistance:
					sourceDistance === undefined || targetDistance === undefined
						? (sourceDistance ?? targetDistance)
						: Math.max(sourceDistance, targetDistance),
				visibleInGraph: true,
			} as unknown as LinkData;
		}),
		colors,
	};
}
