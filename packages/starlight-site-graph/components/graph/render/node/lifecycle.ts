import * as PIXI from 'pixi.js';

import type { NodeDisplay } from '../types';
import type { NodeData, NodeVisualRole } from '../../types';
import type { GraphRenderer } from '../engine';

import { createNodeVisualState } from './state';
import { getNodeStyle, computeNodeShapeTint, computeNodeStrokeTint, getNodeGeometryValues } from './style';
import { drawNodeShape, drawNodeStroke } from './shape';
import { createShapeMorphOutline } from './morph';
import { createLabel } from '../label/render';
import { createTrack } from '../track';

import { destroyDisplayObject, hideDisplayObjects } from '../utils';


export function freeNodeDisplay(stage: PIXI.Container, display: NodeDisplay) {
	destroyDisplayObject(stage, display.node);
	destroyDisplayObject(stage, display.stroke);
	destroyDisplayObject(stage, display.label);
	delete display.node;
	delete display.stroke;
	delete display.label;
	delete display.visual;
}

function destroyNodeDisplay(renderer: GraphRenderer, node: NodeData) {
	const display = renderer.nodeDisplays.get(node.id) ?? renderer.exitingNodeDisplays.get(node.id);
	if (display) {
		freeNodeDisplay(renderer.app.stage, display);
		renderer.nodeDisplays.delete(node.id);
		renderer.exitingNodeDisplays.delete(node.id);
	}
}

export function removeNodeDisplay(renderer: GraphRenderer, node: NodeData) {
	renderer.pendingInitialization.nodes = renderer.pendingInitialization.nodes
		.slice(renderer.pendingInitialization.nodeCursor)
		.filter(candidate => candidate !== node);
	renderer.pendingInitialization.nodeCursor = 0;
	const display = renderer.nodeDisplays.get(node.id);

	if (display?.visual?.visible === false) {
		hideDisplayObjects(display.node, display.stroke, display.label);
		renderer.pendingDisposal.nodes.push(display);
		renderer.nodeDisplays.delete(node.id);
	} else if (display?.node || display?.stroke || display?.label) {
		renderer.getNodeVisual(node).rendered = true;
		renderer.exitingNodeDisplays.set(node.id, display);
		renderer.nodeDisplays.delete(node.id);
		renderer.simulator.requestGraphDraw();
	} else {
		destroyNodeDisplay(renderer, node);
	}
}

export function adoptNodeDisplay(
	nextNode: NodeData,
	sourceDisplay: NodeDisplay,
	renderer: GraphRenderer,
	geometryDirty = false,
) {
	renderer.nodeDisplays.set(nextNode.id, sourceDisplay);
	const visual = renderer.getNodeVisual(nextNode);

	visual.rendered = Boolean(sourceDisplay.node);
	visual.geometryDirty ||= geometryDirty;
	visual.animating ||= geometryDirty || visual.styleDirty || visual.alpha.value < 1;
	const nextLabelText = nextNode.text || nextNode.id;
	if (sourceDisplay.label && sourceDisplay.label.text !== nextLabelText) {
		sourceDisplay.label.text = nextLabelText;
	}

	return visual;
}

export function queueNodeDisplays(renderer: GraphRenderer, nodes: NodeData[]) {
	for (const node of nodes) {
		reinitializeNodeDisplay(renderer, node);
	}

	renderer.pendingInitialization.nodes = [...nodes].sort((a, b) =>
		((a.x ?? 0) * (a.x ?? 0) + (a.y ?? 0) * (a.y ?? 0)) -
		((b.x ?? 0) * (b.x ?? 0) + (b.y ?? 0) * (b.y ?? 0))
	);
	renderer.pendingInitialization.nodeCursor = 0;
}

export function hideNodeDisplay(renderer: GraphRenderer, node: NodeData) {
	const display = renderer.nodeDisplays.get(node.id);
	if (display) {
		hideDisplayObjects(display.node, display.stroke, display.label);
		if (display.visual) {
			display.visual.visible = false;
		}
	}
}

export function reinitializeNodeDisplay(renderer: GraphRenderer, node: NodeData) {
	const display = renderer.getNodeDisplay(node);
	delete display.node;
	delete display.stroke;
	delete display.label;

	display.visual = createNodeVisualState(node);
}

export function createNodeDisplay(renderer: GraphRenderer, node: NodeData) {
	const display = renderer.getNodeDisplay(node);
	const visual = renderer.getNodeVisual(node);
	const style = getNodeStyle(node, 'default');
	const labelOffset = style.labelOffset ?? 0;

	visual.alpha = createTrack(0);
	visual.labelOffset = createTrack(labelOffset);
	visual.labelScale = createTrack(0);
	visual.labelAlpha = createTrack(0);
	visual.role = 'default';

	visual.renderedShapeRotation = createTrack(Number(style.shapeRotation ?? 0));
	visual.renderedComputedSize = createTrack(node.computedSize ?? 0);
	visual.renderedFullRadius = createTrack(node.fullRadius ?? 0);

	visual.hovered = false;
	visual.adjacent = false;
	visual.animating = true;
	visual.geometryDirty = true;
	visual.styleDirty = true;

	const colors = renderer.palette;
	const shapeTint = computeNodeShapeTint(colors, node, 'default');
	visual.shapeTint = createTrack(shapeTint);

	const strokeTint = computeNodeStrokeTint(colors, node, 'default', shapeTint);
	visual.strokeTint = createTrack(strokeTint);

	const requestGraphDraw = () => renderer.simulator.requestGraphDraw();
	const outline = createShapeMorphOutline(style);
	visual.shapeMorph.sync(getNodeGeometryValues(node, 'default'), outline, false, requestGraphDraw);
	visual.strokeMorph.sync(getNodeGeometryValues(node, 'default', true), outline, false, requestGraphDraw);

	display.node = new PIXI.Graphics();
	display.node.alpha = visual.alpha.value;
	if (node.visualStates.default.strokeWidth) {
		display.stroke = new PIXI.Graphics();
		display.stroke.alpha = visual.alpha.value;
		drawNodeStroke(renderer, node, 'default');
		renderer.app.stage.addChild(display.stroke);
	}

	drawNodeShape(renderer, node, 'default');
	renderer.app.stage.addChild(display.node);

	if (renderer.config.renderLabels) {
		createLabel(renderer, node, display);
		renderer.app.stage.addChild(display.label!);
	}
	visual.rendered = true;
}

export function ensureNodeDisplayObjects(renderer: GraphRenderer, node: NodeData, role: NodeVisualRole = 'default') {
	const display = renderer.getNodeDisplay(node);
	const visual = renderer.getNodeVisual(node);
	if (!display.node) {
		display.node = new PIXI.Graphics();
		display.node.alpha = visual.alpha.value;
		renderer.app.stage.addChild(display.node);
		visual.rendered = true;
		visual.animating = true;
		visual.geometryDirty = true;
	}

	const style = getNodeStyle(node, role);
	const applyStroke = Boolean(style.strokeWidth && style.strokeColor);
	if (applyStroke && !display.stroke) {
		display.stroke = new PIXI.Graphics();
		display.stroke.alpha = visual.alpha.value;
		renderer.app.stage.addChildAt(display.stroke, renderer.app.stage.getChildIndex(display.node));
		visual.geometryDirty = true;
	} else if (!applyStroke && display.stroke) {
		destroyDisplayObject(renderer.app.stage, display.stroke);
		delete display.stroke;
		visual.geometryDirty = true;
	}

	if (renderer.config.renderLabels) {
		if (!display.label) {
			createLabel(renderer, node, display);
			renderer.app.stage.addChild(display.label!);
		}
	}

	if (display.label && display.label.style.fontSize !== renderer.config.labelFontSize) {
		display.label.style.fontSize = renderer.config.labelFontSize;
	}
}

export function refreshNodeDisplays(renderer: GraphRenderer, nodes: NodeData[]) {
	if (renderer.config.renderLabels) {
		for (const node of nodes) {
			ensureNodeDisplayObjects(renderer, node);
		}
	}
}
