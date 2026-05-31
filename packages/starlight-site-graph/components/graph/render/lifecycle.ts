import type { LinkData, NodeData } from '../types';
import type { LinkDisplay, NodeDisplay } from './types';
import type { GraphRenderer } from './engine';


import { adoptLinkDisplay, freeLinkDisplay, removeLinkDisplay } from './link/lifecycle';
import { resetLinkDisplayState } from './link/state';

import { adoptNodeDisplay, freeNodeDisplay, removeNodeDisplay, reinitializeNodeDisplay, createNodeDisplay } from './node/lifecycle';
import { nodeGeometrySignature } from './node/geometry';

import { computeLinkKey, indexBy, getNodeIds } from '../utils';

import { MAX_DISPOSALS_PER_FRAME, MAX_INITIALIZATIONS_PER_FRAME } from './constants';

export function syncTopologyLifecycle(
	renderer: GraphRenderer,
	previousNodes: NodeData[],
	previousLinks: LinkData[],
	nextNodes: NodeData[],
	nextLinks: LinkData[],
	previousGeometrySignatures?: Map<string, string>,
) {
	const previousNodesById = getNodeIds(previousNodes);
	const nextNodesById = getNodeIds(nextNodes);

	for (const previousNode of previousNodes) {
		if (!nextNodesById.has(previousNode.id)) {
			removeNodeDisplay(renderer, previousNode);
		}
	}

	const newPendingNodes: NodeData[] = [];
	for (const nextNode of nextNodes) {
		const previousNode = previousNodesById.get(nextNode.id);
		if (previousNode) {
			const previousDisplay = renderer.nodeDisplays.get(previousNode.id)!;
			const previousSignature =
				previousGeometrySignatures?.get(nextNode.id) ?? nodeGeometrySignature(previousNode);
			adoptNodeDisplay(nextNode, previousDisplay, renderer, previousSignature !== nodeGeometrySignature(nextNode));
		} else {
			const exitingDisplay = renderer.exitingNodeDisplays.get(nextNode.id);
			if (exitingDisplay) {
				renderer.exitingNodeDisplays.delete(nextNode.id);
				adoptNodeDisplay(nextNode, exitingDisplay, renderer, true).styleDirty = true;
			} else {
				reinitializeNodeDisplay(renderer, nextNode);
				newPendingNodes.push(nextNode);
			}
		}
	}

	const previousLinksByKey = indexBy(previousLinks, computeLinkKey);
	const nextLinksByKey = indexBy(nextLinks, computeLinkKey);

	for (const previousLink of previousLinks) {
		if (!nextLinksByKey.has(computeLinkKey(previousLink))) {
			removeLinkDisplay(renderer, previousLink);
		}
	}

	for (const nextLink of nextLinks) {
		const linkKey = computeLinkKey(nextLink);
		const previousLink = previousLinksByKey.get(linkKey);
		if (previousLink) {
			const previousDisplay = renderer.linkDisplays.get(computeLinkKey(previousLink))!;
			adoptLinkDisplay(renderer, nextLink, previousDisplay);
		} else {
			const exitingDisplay = renderer.exitingLinkDisplays.get(linkKey);
			if (exitingDisplay) {
				renderer.exitingLinkDisplays.delete(linkKey);
				adoptLinkDisplay(renderer, nextLink, exitingDisplay);
			} else {
				resetLinkDisplayState(renderer, nextLink);
			}
		}
	}

	renderer.pendingInitialization.nodes = [
		...renderer.pendingInitialization.nodes
			.slice(renderer.pendingInitialization.nodeCursor)
			.filter(node => nextNodesById.has(node.id)),
		...newPendingNodes,
	];
	renderer.pendingInitialization.nodeCursor = 0;

	if (newPendingNodes.length > 0) {
		processPendingInitializations(renderer);
	}
}

export function cleanupLifecycle(renderer: GraphRenderer) {
	renderer.pendingInitialization.nodes = [];
	renderer.pendingInitialization.nodeCursor = 0;
	for (const display of renderer.exitingNodeDisplays.values()) {
		freeNodeDisplay(renderer.app.stage, display);
	}
	for (const display of renderer.exitingLinkDisplays.values()) {
		freeLinkDisplay(renderer.app.stage, display);
	}
	renderer.exitingNodeDisplays.clear();
	renderer.exitingLinkDisplays.clear();
	flushPendingDisposals(renderer);

	renderer.nodeDisplays.clear();
	renderer.linkDisplays.clear();
	renderer.linkDisplayCache = new WeakMap();
	renderer.app.stage.removeChildren();
}

export function deferNodeDisposal(renderer: GraphRenderer, display: NodeDisplay) {
	renderer.pendingDisposal.nodes.push(display);
}

export function deferLinkDisposal(renderer: GraphRenderer, display: LinkDisplay) {
	renderer.pendingDisposal.links.push(display);
}

export function processPendingInitializations(renderer: GraphRenderer) {
	if (!hasPendingInitializations(renderer)) {
		return;
	}

	let initialized = 0;
	while (
		initialized < MAX_INITIALIZATIONS_PER_FRAME &&
		renderer.pendingInitialization.nodeCursor < renderer.pendingInitialization.nodes.length
	) {
		createNodeDisplay(renderer, renderer.pendingInitialization.nodes[renderer.pendingInitialization.nodeCursor++]!);
		initialized++;
	}

	if (renderer.pendingInitialization.nodeCursor >= renderer.pendingInitialization.nodes.length) {
		renderer.pendingInitialization.nodes = [];
		renderer.pendingInitialization.nodeCursor = 0;
	}

	if (initialized > 0 || hasPendingInitializations(renderer)) {
		renderer.simulator.requestGraphDraw();
	}
}

export function processPendingDisposals(renderer: GraphRenderer) {
	let remaining = MAX_DISPOSALS_PER_FRAME;
	while (
		remaining > 0 &&
		renderer.pendingDisposal.nodeCursor < renderer.pendingDisposal.nodes.length
	) {
		freeNodeDisplay(
			renderer.app.stage,
			renderer.pendingDisposal.nodes[renderer.pendingDisposal.nodeCursor++]!,
		);
		remaining--;
	}
	if (renderer.pendingDisposal.nodeCursor >= renderer.pendingDisposal.nodes.length) {
		renderer.pendingDisposal.nodes = [];
		renderer.pendingDisposal.nodeCursor = 0;
	}

	while (
		remaining > 0 &&
		renderer.pendingDisposal.linkCursor < renderer.pendingDisposal.links.length
	) {
		freeLinkDisplay(
			renderer.app.stage,
			renderer.pendingDisposal.links[renderer.pendingDisposal.linkCursor++]!,
		);
		remaining--;
	}
	if (renderer.pendingDisposal.linkCursor >= renderer.pendingDisposal.links.length) {
		renderer.pendingDisposal.links = [];
		renderer.pendingDisposal.linkCursor = 0;
	}
}

export function hasPendingDisposals(renderer: GraphRenderer) {
	return renderer.pendingDisposal.nodes.length > 0 || renderer.pendingDisposal.links.length > 0;
}

export function hasPendingInitializations(renderer: GraphRenderer) {
	return renderer.pendingInitialization.nodes.length > 0;
}

function flushPendingDisposals(renderer: GraphRenderer) {
	for (let i = renderer.pendingDisposal.nodeCursor; i < renderer.pendingDisposal.nodes.length; i++) {
		const display = renderer.pendingDisposal.nodes[i]!;
		freeNodeDisplay(renderer.app.stage, display);
	}
	for (let i = renderer.pendingDisposal.linkCursor; i < renderer.pendingDisposal.links.length; i++) {
		const display = renderer.pendingDisposal.links[i]!;
		freeLinkDisplay(renderer.app.stage, display);
	}
	renderer.pendingDisposal.nodes = [];
	renderer.pendingDisposal.links = [];
	renderer.pendingDisposal.nodeCursor = 0;
	renderer.pendingDisposal.linkCursor = 0;
}
