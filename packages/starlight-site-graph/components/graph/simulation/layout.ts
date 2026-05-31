import type { LinkData, NodeData } from '../types';

import { getNodeIds as createNodeMap } from '../utils';
import { INITIAL_NODE_SPACING } from './constants';


export function normalizeTopology(nodes: NodeData[], links: LinkData[]) {
	const nodesById = new Map<string, NodeData>();
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i]!;
		node.index = i;
		nodesById.set(node.id, node);
		if (node.vx === undefined || node.vx === null) {
			node.vx = 0;
		}
		if (node.vy === undefined || node.vy === null) {
			node.vy = 0;
		}
	}

	for (const link of links) {
		if (typeof link.source === 'string') {
			link.source = nodesById.get(link.source as unknown as string)!;
		}
		if (typeof link.target === 'string') {
			link.target = nodesById.get(link.target as unknown as string)!;
		}
	}

	return nodesById;
}

export function captureTopologyNodeState(nodes: NodeData[]) {
	return new Map<string, Pick<NodeData, 'x' | 'y' | 'vx' | 'vy' | 'fx' | 'fy'>>(
		nodes.map(node => [
			node.id,
			{
				x: node.x ?? 0,
				y: node.y ?? 0,
				vx: node.vx ?? 0,
				vy: node.vy ?? 0,
				fx: node.fx ?? null,
				fy: node.fy ?? null,
			},
		]),
	);
}

export function restoreTopologyNodeState(
	nextNodes: NodeData[],
	previousNodes: NodeData[],
	topologyNodeState: Map<string, Pick<NodeData, 'x' | 'y' | 'vx' | 'vy' | 'fx' | 'fy'>>,
) {
	const previousNodesById = createNodeMap(previousNodes);
	for (const node of nextNodes) {
		const previousNode = previousNodesById.get(node.id);
		if (previousNode) {
			node.x = previousNode.x ?? 0;
			node.y = previousNode.y ?? 0;
			node.vx = 0;
			node.vy = 0;
			node.fx = previousNode.fx ?? null;
			node.fy = previousNode.fy ?? null;
			continue;
		}

		const cachedNode = topologyNodeState.get(node.id);
		if (cachedNode) {
			node.x = cachedNode.x ?? 0;
			node.y = cachedNode.y ?? 0;
			node.vx = 0;
			node.vy = 0;
			node.fx = null;
			node.fy = null;
		}
	}
}

export function initializeNodePositions(
	nodes: NodeData[],
	currentNode: NodeData | undefined,
	nodeMap: Map<string, NodeData>,
): void {
	if (nodes.length === 0) {
		return;
	}

	const hasExplicitPosition = (node: NodeData) =>
		node.x !== undefined && node.x !== null && node.y !== undefined && node.y !== null;
	const placed = new Set<NodeData>(nodes.filter(hasExplicitPosition));
	const pending = new Set<NodeData>(nodes.filter(node => !placed.has(node)));

	if (pending.size === 0) {
		return;
	}

	const anchor =
		currentNode ?? nodes.reduce((best, node) => (node.adjacent.size > best.adjacent.size ? node : best), nodes[0]!);
	if (pending.has(anchor)) {
		anchor.x = 0;
		anchor.y = 0;
		placed.add(anchor);
		pending.delete(anchor);
	}

	const getRelatedPlaced = (node: NodeData) => {
		const related: NodeData[] = [];
		for (const id of node.adjacent) {
			const other = nodeMap.get(id);
			if (other && placed.has(other)) {
				related.push(other);
			}
		}
		return related;
	};

	while (pending.size > 0) {
		let progressed = false;
		const pendingNodes = [...pending].sort((a, b) => b.adjacent.size - a.adjacent.size);
		const pendingSpread = INITIAL_NODE_SPACING * Math.sqrt(Math.max(1, pending.size));

		for (const node of pendingNodes) {
			const related = getRelatedPlaced(node);
			if (related.length === 0) {
				continue;
			}

			let x = 0;
			let y = 0;
			for (const other of related) {
				x += other.x ?? 0;
				y += other.y ?? 0;
			}
			x /= related.length;
			y /= related.length;

			node.x = x + (Math.random() - 0.5) * pendingSpread;
			node.y = y + (Math.random() - 0.5) * pendingSpread;
			placed.add(node);
			pending.delete(node);
			progressed = true;
		}

		if (progressed) {
			continue;
		}

		let maxRadiusSq = 0;
		for (const node of placed) {
			const x = node.x ?? 0;
			const y = node.y ?? 0;
			maxRadiusSq = Math.max(maxRadiusSq, x * x + y * y);
		}

		const ringArea = INITIAL_NODE_SPACING * pending.size * INITIAL_NODE_SPACING;
		const currentRadius = Math.sqrt(maxRadiusSq);
		const ringWidth = Math.sqrt(ringArea / Math.PI + currentRadius * currentRadius) - currentRadius;

		for (const node of pendingNodes) {
			const angle = Math.random() * Math.PI * 2;
			const radius = currentRadius + Math.sqrt(Math.random()) * Math.max(ringWidth, INITIAL_NODE_SPACING);
			node.x = radius * Math.cos(angle);
			node.y = radius * Math.sin(angle);
			placed.add(node);
			pending.delete(node);
		}
	}
}

export function createColliderRadii(nodes: NodeData[], colliderPadding: number) {
	const colliderRadii = new Float32Array(nodes.length);
	for (let i = 0; i < nodes.length; i++) {
		colliderRadii[i] = (nodes[i]!.colliderSize ?? nodes[i]!.fullRadius ?? 0) + colliderPadding;
	}
	return colliderRadii;
}

export function applyWorkerTick(nodes: NodeData[], data: Float32Array) {
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i]!;
		node.x = data[4 * i]!;
		node.y = data[4 * i + 1]!;
		node.vx = data[4 * i + 2]!;
		node.vy = data[4 * i + 3]!;
	}
}
