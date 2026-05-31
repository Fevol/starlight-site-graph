import type { NodeVisualState } from '../types';
import type { NodeData, NodeVisualRole } from '../../types';

import { createTrack } from '../track';
import { ShapeMorph } from './morph';
import { resolveShapeCornerRadius, resolveStrokeCornerRadius, computeNodeSizes } from '../../topology/style';

export function createNodeVisualState(node: NodeData): NodeVisualState {
	const style = node.visualStates.default;
	const { computedSize } = computeNodeSizes(style, node.sizeMultiplier ?? 1);
	const cornerRadius = resolveShapeCornerRadius(style, computedSize);
	const strokeCornerRadius = resolveStrokeCornerRadius(style);

	return {
		rendered: false,
		visible: false,
		role: 'default',
		hovered: false,
		adjacent: false,
		geometryDirty: true,
		styleDirty: true,
		alpha: createTrack(0),
		shapeTint: createTrack(0xffffff),
		strokeTint: createTrack(0xffffff),
		animating: true,
		labelOffset: createTrack(0),
		labelScale: createTrack(0),
		labelAlpha: createTrack(0),
		renderedShapeRotation: createTrack(Number(style.shapeRotation ?? 0)),
		renderedComputedSize: createTrack(node.computedSize ?? 0),
		renderedFullRadius: createTrack(node.fullRadius ?? 0),
		renderedCornerRadius: createTrack(cornerRadius),
		renderedStrokeCornerRadius: createTrack(strokeCornerRadius),
		shapeMorph: new ShapeMorph(),
		strokeMorph: new ShapeMorph(),
	};
}

export function getNodeVisualRole(node: NodeData, hoveredId: string): NodeVisualRole {
	if (!hoveredId) {
		return 'default';
	} else if (node.id === hoveredId) {
		return 'hovered';
	} else if (node.adjacent.has(hoveredId)) {
		return 'adjacent';
	} else {
		return 'muted';
	}
}
