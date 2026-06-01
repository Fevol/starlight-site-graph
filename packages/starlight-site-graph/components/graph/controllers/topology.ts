import type { Graph } from '../graph';
import type { GraphData, LinkData, NodeData } from '../types';

import { computeLinkKey, getNodeId, keySet, indexBy, getNodeIds } from '../utils';

import { nodeGeometrySignature } from '../render/node/geometry';

import { processSitemapData } from '../topology/topology';
import { syncLinkTopologyData, syncNodeTopologyData } from '../topology/style';
import { TOPOLOGY_GEOMETRY_RESTART_ALPHA, TOPOLOGY_RESTART_ALPHA_MAX, TOPOLOGY_RESTART_ALPHA_MIN } from '../topology/constants';

export class TopologyController {
	private topologyCache = new Map<string, GraphData>();
	private topologyCacheVersion = 0;

	constructor(private context: Graph) {}

	destroy() {
		this.invalidateCache();
	}

	invalidateCache() {
		this.topologyCache.clear();
		this.topologyCacheVersion++;
	}

	refreshTopology() {
		if (!this.context.simulator.mounted) {
			return false;
		}

		const { nodes: previousNodes, links: previousLinks } = this.context.simulator;

		const { nodes: rawNodes, links: rawLinks, colors } = this.getProcessedGraphData();
		this.context.styleController.syncColorPalette(colors);

		if (!this.canSkipTopologyRefresh(previousNodes, previousLinks, rawNodes, rawLinks)) {
			const { nodes, links, previousGeometrySignatures } = this.reconcileTopologyData(previousNodes, previousLinks, rawNodes, rawLinks);

			this.context.renderer.syncTopology(previousNodes, previousLinks, nodes, links, previousGeometrySignatures);
			this.context.simulator.updateTopology(nodes, links, nodes.find(node => node.id === this.context.currentPage));

			this.context.lifecycleController.requestGraphDraw();
			this.context.simulator.syncForces(this.getTopologyRestartAlpha(previousNodes, previousLinks, nodes, links));
		}

		return true;
	}

	getProcessedGraphData(depthOverride?: number): GraphData {
		const cacheKey = this.getTopologyCacheKey(depthOverride);
		let graphData = this.topologyCache.get(cacheKey);
		if (!graphData) {
			graphData = processSitemapData(this.context, this.context.sitemap, depthOverride);
			this.topologyCache.set(cacheKey, graphData);
		}

		return this.cloneGraphData(graphData);
	}

	private getTopologyCacheKey(depthOverride?: number) {
		return JSON.stringify({
			version: this.topologyCacheVersion,
			currentPage: this.context.currentPage,
			depth: depthOverride ?? this.context.config.depth,
			depthDirection: this.context.config.depthDirection,
			nodeSizeBy: this.context.config.nodeSizeBy,
			renderUnresolved: this.context.config.renderUnresolved,
			renderExternal: this.context.config.renderExternal,
			tagRenderMode: this.context.config.tagRenderMode,
			nodeInclusionRules: this.context.config.nodeInclusionRules,
			nodeDefaultStyle: this.context.config.nodeDefaultStyle,
			nodeVisitedStyle: this.context.config.nodeVisitedStyle,
			nodeCurrentStyle: this.context.config.nodeCurrentStyle,
			nodeUnresolvedStyle: this.context.config.nodeUnresolvedStyle,
			nodeExternalStyle: this.context.config.nodeExternalStyle,
			tagDefaultStyle: this.context.config.tagDefaultStyle,
			tagStyles: this.context.config.tagStyles,
		});
	}

	private cloneGraphData(graphData: GraphData): GraphData {
		return {
			nodes: graphData.nodes.map(node => ({ ...node, adjacent: new Set(node.adjacent) })),
			links: graphData.links.map(link => ({ ...link })) as LinkData[],
			colors: { ...graphData.colors },
		};
	}

	private canSoftRefresh(
		previousNodes: NodeData[], previousLinks: LinkData[],
		nextNodes: NodeData[], nextLinks: LinkData[],
	) {
		if (previousNodes.length !== nextNodes.length || previousLinks.length !== nextLinks.length) {
			return false;
		}

		const previousNodeIds = keySet(previousNodes, node => node.id);
		if (!nextNodes.every(({ id }) => previousNodeIds.has(id))) {
			return false;
		}

		const previousLinkKeys = keySet(previousLinks, computeLinkKey);
		return nextLinks.every(link => previousLinkKeys.has(computeLinkKey(link)));
	}

	private getTopologyRestartAlpha(
		previousNodes: NodeData[], previousLinks: LinkData[],
		nextNodes: NodeData[], nextLinks: LinkData[],
	) {
		const previousNodeIds = keySet(previousNodes, node => node.id);
		const nextNodeIds = keySet(nextNodes, node => node.id);
		const previousLinkKeys = keySet(previousLinks, computeLinkKey);
		const nextLinkKeys = keySet(nextLinks, computeLinkKey);

		let changed = 0;
		for (const id of previousNodeIds) if (!nextNodeIds.has(id)) changed++;
		for (const id of nextNodeIds) if (!previousNodeIds.has(id)) changed++;
		for (const key of previousLinkKeys) if (!nextLinkKeys.has(key)) changed++;
		for (const key of nextLinkKeys) if (!previousLinkKeys.has(key)) changed++;

		const baseline = Math.max(previousNodes.length + previousLinks.length, nextNodes.length + nextLinks.length, 1);
		const impact = Math.min(1, changed / baseline);
		return TOPOLOGY_RESTART_ALPHA_MIN + (TOPOLOGY_RESTART_ALPHA_MAX - TOPOLOGY_RESTART_ALPHA_MIN) * impact;
	}

	private canSkipTopologyRefresh(
		previousNodes: NodeData[], previousLinks: LinkData[],
		nextNodes: NodeData[], nextLinks: LinkData[],
	) {
		if (!this.canSoftRefresh(previousNodes, previousLinks, nextNodes, nextLinks)) {
			return false;
		}

		const previousNodesById = getNodeIds(previousNodes);
		for (const nextNode of nextNodes) {
			const previousNode = previousNodesById.get(nextNode.id);
			if (!previousNode || nodeGeometrySignature(previousNode) !== nodeGeometrySignature(nextNode) || previousNode.text !== nextNode.text) {
				return false;
			}
		}

		return true;
	}

	private reconcileLink(link: LinkData, nodesById: Map<string, NodeData>, previousLinksByKey: Map<string, LinkData>) {
		const previousLink = previousLinksByKey.get(computeLinkKey(link));

		const source = nodesById.get(getNodeId(link.source))!;
		const target = nodesById.get(getNodeId(link.target))!;

		if (!previousLink) {
			link.source = source;
			link.target = target;
			return link;
		} else {
			previousLink.source = source;
			previousLink.target = target;
			syncLinkTopologyData(previousLink, link);
			return previousLink;
		}
	}

	private reconcileTopologyData(
		previousNodes: NodeData[], previousLinks: LinkData[],
		nextNodes: NodeData[], nextLinks: LinkData[],
	) {
		const previousNodesById = getNodeIds(previousNodes);
		const previousGeometrySignatures = new Map<string, string>();
		const reconciledNodes: NodeData[] = nextNodes.map(nextNode => {
			const previousNode = previousNodesById.get(nextNode.id);
			if (!previousNode) {
				return nextNode;
			} else {
				previousGeometrySignatures.set(previousNode.id, nodeGeometrySignature(previousNode));
				syncNodeTopologyData(previousNode, nextNode);
				return previousNode;
			}
		});

		const reconciledNodesById = getNodeIds(reconciledNodes);
		const previousLinksByKey = indexBy(previousLinks, computeLinkKey);
		const reconciledLinks = nextLinks.map(link =>
			this.reconcileLink(link, reconciledNodesById, previousLinksByKey)
		);

		return { nodes: reconciledNodes, links: reconciledLinks, previousGeometrySignatures };
	}

	refreshStyles() {
		if (!this.context.simulator.mounted) {
			return false;
		}

		const { nodes: previousNodes, links: previousLinks } = this.context.simulator;
		const { nodes, links, colors } = this.getProcessedGraphData();

		if (!this.canSoftRefresh(previousNodes, previousLinks, nodes, links)) {
			return false;
		}

		this.context.styleController.syncColorPalette(colors);

		const previousNodesById = getNodeIds(previousNodes);
		let geometryChanged = false;

		for (const nextNode of nodes) {
			const previousNode = previousNodesById.get(nextNode.id);
			if (!previousNode) {
				continue;
			}

			const { colliderSize: previousColliderSize, computedSize: previousComputedSize, fullRadius: previousFullRadius } = previousNode;

			syncNodeTopologyData(previousNode, nextNode);

			if (
				previousComputedSize !== nextNode.computedSize ||
				previousFullRadius !== nextNode.fullRadius ||
				previousColliderSize !== nextNode.colliderSize
			) {
				geometryChanged = true;
			}

			const display = this.context.renderer.getNodeDisplay(previousNode);
			if (display.visual) {
				display.visual.geometryDirty = true;
				display.visual.styleDirty = true;
				display.visual.animating = true;
			}

			if (display.label) {
				display.label.text = previousNode.text || previousNode.id;
			}
		}

		const nextLinksByKey = keySet(links, computeLinkKey);
		if (previousLinks.some(link => !nextLinksByKey.has(computeLinkKey(link)))) {
			return false;
		}

		this.context.simulator.currentNode = previousNodesById.get(this.context.currentPage);
		this.context.lifecycleController.requestGraphDraw();
		if (geometryChanged) {
			this.context.simulator.syncColliders(TOPOLOGY_GEOMETRY_RESTART_ALPHA);
		}

		return true;
	}
}
