import * as PIXI from 'pixi.js';

import type { NodeData, NodeVisualRole } from '../../types';
import type { GraphRenderer } from '../engine';
import type { NodeDisplay, } from '../types';

import { getCurrentLabelOpacity, getViewportBounds, type ViewportBounds } from '../../transform';
import { getNodeStyle, computeNodeLabelTint } from '../node/style';

import { GRAPH_EPSILON } from '../../constants';
import {
	LABEL_CULL_NODE_COUNT, LABEL_CULL_ZOOM, LABEL_DEFAULT_Z_INDEX,
	MIN_RENDER_ZOOM, MIN_VISIBLE_ALPHA, NODE_LABEL_VIEWPORT_PADDING,
} from '../constants';


export function createLabel(renderer: GraphRenderer, node: NodeData, display: NodeDisplay) {
	display.label = new PIXI.Text({
		text: node.text || node.id,
		resolution: renderer.labelResolution,
		style: { fill: 0xffffff, fontSize: renderer.config.labelFontSize },
		zIndex: LABEL_DEFAULT_Z_INDEX,
	});
	display.label.anchor.set(0.5, 0.5);
	display.label.alpha = 0;
	display.label.visible = false;
	display.label.position.set(node.x ?? 0, node.y ?? 0);
}

export function syncLabelResolution(renderer: GraphRenderer) {
	const resolution = renderer.labelResolution;
	for (const display of renderer.nodeDisplays.values()) {
		if (display.label && display.label.resolution !== resolution) {
			display.label.resolution = resolution;
		}
	}
}

export function computeNodeLabelState(renderer: GraphRenderer, node: NodeData, hovered?: boolean, adjacent?: boolean, precomputedLabelViewport?: ViewportBounds) {
	const visual = renderer.getNodeVisual(node);
	const role: NodeVisualRole = hovered ? 'hovered' : adjacent ? 'adjacent' : visual.role;
	const style = getNodeStyle(node, role);
	const zoom = renderer.animation.zoom.value;
	const nodeZoomScale = Math.sqrt(1 / Math.max(zoom, GRAPH_EPSILON));
	const labelViewport = precomputedLabelViewport ?? getViewportBounds(
		renderer.renderedTransform,
		renderer.viewportWidth,
		renderer.viewportHeight,
		NODE_LABEL_VIEWPORT_PADDING / Math.max(zoom, MIN_RENDER_ZOOM),
	);

	const zoomOpacity = (hovered || adjacent) ? 1 : getCurrentLabelOpacity(zoom, renderer.config.labelZoomOpacityScale);
	let labelAlpha = zoomOpacity * (style.labelOpacity ?? 1);
	if (!hovered && !adjacent && renderer.simulator.nodes.length > LABEL_CULL_NODE_COUNT && zoom < LABEL_CULL_ZOOM) {
		labelAlpha = 0;
	}

	const x = node.x!;
	const y =
		node.y! +
		visual.renderedFullRadius.value * nodeZoomScale +
		visual.labelOffset.value / Math.max(zoom, GRAPH_EPSILON);
	if (
		x < labelViewport.minX ||
		x > labelViewport.maxX ||
		y < labelViewport.minY ||
		y > labelViewport.maxY
	) {
		labelAlpha = 0;
	}

	labelAlpha *= visual.alpha.value * renderer.animation.labelsEnabled.value;
	return {
		x,
		y,
		scale: Math.max(1 + visual.labelScale.value, nodeZoomScale) * nodeZoomScale,
		alpha: labelAlpha,
		tint: computeNodeLabelTint(
			renderer.palette,
			renderer.animation,
			node,
			role,
			Boolean(hovered),
		),
		visible: labelAlpha > MIN_VISIBLE_ALPHA,
	};
}

export function updateLabel(renderer: GraphRenderer, node: NodeData, hovered?: boolean, adjacent?: boolean, precomputedLabelViewport?: ViewportBounds) {
	const display = renderer.getNodeDisplay(node);
	const visual = renderer.getNodeVisual(node);
	const state = computeNodeLabelState(renderer, node, hovered, adjacent, precomputedLabelViewport);

	if (!visual.animating) {
		visual.labelAlpha.value = state.alpha;
		visual.labelAlpha.target = state.alpha;
		visual.labelAlpha.source = state.alpha;
	}

	const labelAlpha = visual.labelAlpha.value;
	display.label!.scale.set(state.scale);
	display.label!.position.set(state.x, state.y);
	display.label!.alpha = labelAlpha;
	display.label!.tint = state.tint;
	display.label!.visible = labelAlpha > MIN_VISIBLE_ALPHA;
}
