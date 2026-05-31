import * as PIXI from 'pixi.js';

import type { NodeShapeType, NodeStyle } from '../../config/types';
import type { NodeData, NodeVisualRole } from '../../types';
import type { GraphRenderer } from '../engine';

import { getNodeStyle } from './style';

import {
	NODE_DEFAULT_Z_INDEX, NODE_HOVER_Z_INDEX, NODE_MUTED_Z_INDEX,
	SHAPE_STAR_LINE_DEPTH,
	STROKE_DEFAULT_Z_INDEX, STROKE_HOVER_Z_INDEX, STROKE_MUTED_Z_INDEX,
} from '../constants';

export function getNodeZIndex(role: NodeVisualRole) {
	return role === 'default' ? NODE_DEFAULT_Z_INDEX : role === 'hovered' ? NODE_HOVER_Z_INDEX : NODE_MUTED_Z_INDEX;
}

export function getStrokeZIndex(role: NodeVisualRole) {
	return role === 'default' ? STROKE_DEFAULT_Z_INDEX : role === 'hovered' ? STROKE_HOVER_Z_INDEX : STROKE_MUTED_Z_INDEX;
}

function hasCornerStroke(cornerRadius: number) {
	return cornerRadius > 0;
}

function applyCornerStroke(graphics: PIXI.Graphics, cornerType: NodeStyle['cornerType'], cornerRadius: number) {
	if (cornerRadius > 0) {
		const join: 'round' | 'bevel' = cornerType === 'bevel' ? 'bevel' : 'round';
		graphics.stroke({ color: 0xffffff, width: cornerRadius, join });
	}
}

function drawNodeShapePath(
	graphics: PIXI.Graphics,
	shape: NodeShapeType,
	size: number,
	rotation: number,
	points?: number,
) {
	if (shape === 'circle') {
		graphics.circle(0, 0, size);
	}

	else if (shape === 'polygon') {
		const angle = (Math.PI * 2) / points!;
		graphics.moveTo(size, 0);
		for (let i = 0; i < points!; i++) {
			graphics.lineTo(size * Math.cos(-angle * i), size * Math.sin(-angle * i));
		}
		graphics.closePath();
	}

	else if (shape === 'star') {
		graphics.moveTo(0, -size);
		for (let i = 0; i < 2 * points!; i++) {
			const angle = (Math.PI * 2 * i) / (2 * points!);
			const radius = i % 2 === 0 ? size : size * SHAPE_STAR_LINE_DEPTH;
			graphics.lineTo(radius * Math.sin(angle), -radius * Math.cos(angle));
		}
		graphics.closePath();
	}

	else {
		console.error('[STARLIGHT-SITE-GRAPH] Invalid shape type: ' + shape);
	}
	graphics.rotation = rotation;
	return graphics;
}

export function drawNodeShape(renderer: GraphRenderer, node: NodeData, role: NodeVisualRole = 'default') {
	const visual = renderer.getNodeVisual(node);
	const graphic = renderer.getNodeDisplay(node).node!;

	const style = getNodeStyle(node, role);
	const cornerRadius = visual.renderedCornerRadius.value;
	const size = visual.renderedComputedSize.value;
	const drawSize = hasCornerStroke(cornerRadius)
		? Math.max(0, size - cornerRadius)
		: size;

	graphic.clear();
	const morphing = visual.shapeMorph.draw(graphic, drawSize);
	if (!morphing) {
		drawNodeShapePath(graphic, style.shape!, drawSize, visual.renderedShapeRotation.value, Number(style.shapePoints ?? 0));
	}

	graphic.fill(0xffffff)._zIndex = getNodeZIndex(role);
	applyCornerStroke(graphic, style.cornerType, cornerRadius);
	graphic.tint = visual.shapeTint.value;

	if (morphing) {
		graphic.rotation = visual.renderedShapeRotation.value;
	}
}

export function drawNodeStroke(renderer: GraphRenderer, node: NodeData, role: NodeVisualRole = 'default') {
	const visual = renderer.getNodeVisual(node);
	const graphic = renderer.getNodeDisplay(node).stroke!;

	const style = getNodeStyle(node, role);
	const cornerRadius = visual.renderedStrokeCornerRadius.value;
	const size = visual.renderedFullRadius.value;
	const drawSize = hasCornerStroke(cornerRadius)
		? Math.max(0, size - cornerRadius / 2)
		: size;

	graphic.clear();
	graphic._zIndex = getStrokeZIndex(role);
	const morphing = visual.strokeMorph.draw(graphic, drawSize);
	if (!morphing) {
		drawNodeShapePath(graphic, style.shape!, drawSize, visual.renderedShapeRotation.value, Number(style.shapePoints ?? 0));
	}

	graphic.fill(0xffffff);
	applyCornerStroke(graphic, style.cornerType, cornerRadius);
	graphic.tint = visual.strokeTint.value;
	if (morphing) {
		graphic.rotation = visual.renderedShapeRotation.value;
	}
}
