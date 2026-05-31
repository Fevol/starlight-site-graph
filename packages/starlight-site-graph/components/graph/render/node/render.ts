import type { NodeData } from '../../types';
import type { GraphRenderer } from '../engine';

import { getViewportBounds } from '../../transform';
import { hideNodeDisplay, ensureNodeDisplayObjects } from './lifecycle';
import { getNodeZoomScale, getRenderedFullRadius, nodeIntersectsViewport } from './geometry';
import { updateLabel } from '../label/render';
import { getNodeStyleValues } from './style';
import { drawNodeShape, drawNodeStroke, getNodeZIndex, getStrokeZIndex } from './shape';
import { syncNodeMorphTargets } from './morph';

import { MIN_RENDER_ZOOM, NODE_LABEL_VIEWPORT_PADDING, NODE_VIEWPORT_PADDING, NODE_VISIBILITY_PADDING } from '../constants';


function applyNodeDisplay(renderer: GraphRenderer, node: NodeData, scale: number, hovered: boolean, adjacent: boolean) {
	const display = renderer.getNodeDisplay(node);
	const visual = renderer.getNodeVisual(node);
	const role = visual.role;

	if (!visual.geometryDirty || !visual.styleDirty) {
		const styleValues = getNodeStyleValues(node, role);
		if (visual.styleValues !== styleValues) {
			visual.styleValues = styleValues;
			visual.geometryDirty = true;
			visual.styleDirty = true;
		}
	}

	ensureNodeDisplayObjects(renderer, node, role);
	syncNodeMorphTargets(renderer, node, role);

	display.node!.visible = true;
	display.node!.scale.set(scale);
	display.node!.position.set(node.x!, node.y!);

	if (display.stroke) {
		display.stroke.visible = true;
		display.stroke.scale.set(scale);
		display.stroke.position.set(node.x!, node.y!);
	}

	if (visual.geometryDirty) {
		if (display.stroke) {
			drawNodeStroke(renderer, node, role);
		}
		drawNodeShape(renderer, node, role);
		visual.geometryDirty = false;
		visual.styleDirty = false;
	}

	else if (visual.styleDirty || visual.hovered !== hovered || visual.adjacent !== adjacent) {
		display.node!._zIndex = getNodeZIndex(role);
		display.node!.tint = visual.shapeTint.value;

		if (display.stroke) {
			display.stroke._zIndex = getStrokeZIndex(role);
			display.stroke.tint = visual.strokeTint.value;
		}
		visual.styleDirty = false;
	}

	visual.hovered = hovered;
	visual.adjacent = adjacent;
}

export function drawNodes(renderer: GraphRenderer, nodes: NodeData[], extraNodes: Iterable<NodeData> = []) {
	const zoom = renderer.context.animationState.zoom.value;
	const scale = getNodeZoomScale(zoom, renderer.context.config.scaleNodes);
	const zoomClamped = Math.max(zoom, MIN_RENDER_ZOOM);
	const viewport = getViewportBounds(
		renderer.renderedTransform,
		renderer.viewportWidth,
		renderer.viewportHeight,
		NODE_VIEWPORT_PADDING / zoomClamped,
	);
	const labelViewport = renderer.context.config.renderLabels
		? getViewportBounds(
			renderer.renderedTransform,
			renderer.viewportWidth,
			renderer.viewportHeight,
			NODE_LABEL_VIEWPORT_PADDING / zoomClamped,
		)
		: undefined;

	const visibilityPadding = NODE_VISIBILITY_PADDING / zoomClamped;

	function processNode(node: NodeData) {
		const display = renderer.getNodeDisplay(node);
		const visual = renderer.getNodeVisual(node);
		if (!visual.rendered || !display.node) {
			return;
		} else if (!nodeIntersectsViewport(node, viewport, getRenderedFullRadius(renderer, node), visibilityPadding)) {
			hideNodeDisplay(renderer, node);
		} else {
			visual.visible = true;

			const role = visual.role;
			const hovered = role === 'hovered';
			const adjacent = role === 'adjacent';

			applyNodeDisplay(renderer, node, scale, hovered, adjacent);
			if (display.label || renderer.context.config.renderLabels) {
				updateLabel(renderer, node, hovered, adjacent, labelViewport);
			}
		}
	}

	for (const node of nodes) {
		processNode(node);
	}
	for (const node of extraNodes) {
		processNode(node);
	}
}
