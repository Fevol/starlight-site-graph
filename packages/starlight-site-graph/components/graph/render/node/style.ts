import type { NodeStyle } from '../../config/types';
import type { GraphColorConfig } from '../../color';
import type { NodeData, NodeVisualRole } from '../../types';
import type { AnimationState } from '../transitions';

import { computeNodeSizes, resolveShapeCornerRadius, resolveStrokeCornerRadius } from '../../topology/style';
import { hexToRGBNumber } from '../utils';


const NODE_STYLE_KEYS = [
	'shape',
	'shapeSize',
	'shapeColor',
	'strokeWidth',
	'strokeColor',
	'shapePoints',
	'shapeRotation',
	'shapeCornerRadius',
	'strokeCornerRadius',
	'labelOffset',
	'labelOpacity',
	'labelColor',
	'labelScale',
	'cornerType',
	'colliderScale',
	'nodeScale',
	'sizingStrength',
] as const satisfies readonly (keyof NodeStyle)[];

export function getNodeStyle(node: NodeData, role: NodeVisualRole) {
	return node.visualStates[role];
}

export function getNodeStyleValues(node: NodeData, role: NodeVisualRole) {
	const style = getNodeStyle(node, role);
	return JSON.stringify(NODE_STYLE_KEYS.map(key => style[key]));
}

export function getNodeGeometryTargets(node: NodeData, role: NodeVisualRole) {
	return computeNodeSizes(getNodeStyle(node, role), node.sizeMultiplier ?? 1);
}

export function getNodeGeometryValues(node: NodeData, role: NodeVisualRole, stroke = false) {
	const style = getNodeStyle(node, role);
	const geometry = getNodeGeometryTargets(node, role);
	const cornerRadius = stroke
		? resolveStrokeCornerRadius(style)
		: resolveShapeCornerRadius(style, geometry.computedSize);
	return JSON.stringify([
		style.shape,
		style.shapePoints,
		stroke ? geometry.fullRadius : geometry.computedSize,
		cornerRadius,
	]);
}

function computeNodePaletteTint(colors: GraphColorConfig, colorKey: string): number {
	return hexToRGBNumber(colors[colorKey] ?? colors['nodeColor'] ?? '#ffffff');
}

export function computeNodeShapeTint(colors: GraphColorConfig, node: NodeData, role: NodeVisualRole): number {
	return computeNodePaletteTint(colors, getNodeStyle(node, role).shapeColor!);
}

export function computeNodeStrokeTint(
	colors: GraphColorConfig,
	node: NodeData,
	role: NodeVisualRole,
	shapeTint?: number,
): number {
	const style = getNodeStyle(node, role);
	if (style.strokeColor === 'inherit') {
		return shapeTint ?? computeNodeShapeTint(colors, node, role);
	} else {
		return computeNodePaletteTint(colors, style.strokeColor!);
	}
}

export function computeNodeLabelTint(
	colors: GraphColorConfig,
	animationState: AnimationState,
	node: NodeData,
	role: NodeVisualRole,
	hovered: boolean,
) {
	const style = getNodeStyle(node, role);
	if (style.labelColor) {
		return computeNodePaletteTint(colors, style.labelColor);
	} else {
		return animationState[hovered ? 'labelColorHover' : 'labelColor'].value;
	}
}
