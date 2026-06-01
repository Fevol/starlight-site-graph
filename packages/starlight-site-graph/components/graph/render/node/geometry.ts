import type { BoundsData } from 'pixi.js';

import type { NodeData } from '../../types';
import type { GraphRenderer } from '../engine';
import type { NodeLinkBoundaryGeometry, NodeVisualState } from '../types';

import { GRAPH_EPSILON } from '../../constants';

export function getNodeZoomScale(zoom: number, factor: number = 1) {
	return Math.pow(1 / Math.max(zoom, GRAPH_EPSILON), 0.5 * factor);
}

export function getRenderedFullRadius(renderer: GraphRenderer, node: NodeData) {
	return renderer.getNodeVisual(node).renderedFullRadius.value;
}

export function getRenderedNodeRadius(renderer: GraphRenderer, node: NodeData) {
	return getRenderedFullRadius(renderer, node) * getNodeZoomScale(renderer.animation.zoom.value, renderer.config.scaleNodes);
}

export function getNodeLinkBoundaryGeometry(
	renderer: GraphRenderer,
	node: NodeData,
	visual: NodeVisualState,
): NodeLinkBoundaryGeometry {
	const radius = getRenderedNodeRadius(renderer, node);
	const zoomScale = radius / Math.max(visual.renderedFullRadius.value, GRAPH_EPSILON);
	const hasStroke = (node.visualStates.default.strokeWidth ?? 0) > 0;
	const cornerRadius = (hasStroke ? visual.renderedStrokeCornerRadius.value : visual.renderedCornerRadius.value) * zoomScale;
	const pathRadius = hasStroke
		? Math.max(0, radius - cornerRadius / 2)
		: Math.max(0, radius - cornerRadius);
	const outline = hasStroke ? visual.strokeMorph.outline : visual.shapeMorph.outline;

	return {
		radius,
		pathRadius,
		cornerRadius,
		rotation: visual.renderedShapeRotation.value,
		...(outline ? { outline } : {}),
	};
}

export function nodeIntersectsViewport(node: NodeData, viewport: BoundsData, radius: number, padding: number = 0) {
	const boundedRadius = radius + padding;
	return !(
		node.x! + boundedRadius < viewport.minX || node.x! - boundedRadius > viewport.maxX ||
		node.y! + boundedRadius < viewport.minY || node.y! - boundedRadius > viewport.maxY
	);
}

export function nodeGeometrySignature(node: NodeData) {
	const style = node.visualStates.default;
	return [
		style.shape,
		style.shapeSize,
		style.shapeColor,
		style.strokeWidth,
		style.strokeColor,
		style.shapePoints,
		style.shapeRotation,
		style.shapeCornerRadius,
		style.strokeCornerRadius,
		style.cornerType,
		node.computedSize,
		node.fullRadius,
		node.colliderSize,
	].join('|');
}
