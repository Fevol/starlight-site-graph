import type { GraphComponent } from '../graph-component';
import type { NodeStateStyle, NodeStateStyles, NodeStyle } from '../config/types';
import type { LinkData, NodeData, NodeVisualStyles } from '../types';
import type { GraphColorConfig } from '../color';

import { cssVariablesMap } from '../color';
import { syncOptionalProperties } from '../utils';

import {
	CORNER_RADIUS_EPSILON, DEFAULT_CORNER_RADIUS, DEFAULT_POLYGON_POINTS, DEFAULT_STAR_POINTS, DEFAULT_STROKE_WIDTH,
	NEIGHBORS_SIZE_DEPTH_BOOST, NEIGHBORS_SIZE_MIN_INPUT, NEIGHBORS_SIZE_MAX_NEIGHBORS,
	NEIGHBORS_SIZE_MULTIPLIER, NEIGHBORS_SIZE_MIN_NEIGHBORS,
	NODE_TOPOLOGY_KEYS, NODE_VISUAL_ROLES, OPTIONAL_LINK_TOPOLOGY_KEYS, OPTIONAL_NODE_TOPOLOGY_KEYS
} from './constants';

export function syncNodeTopologyData(target: NodeData, source: NodeData) {
	for (const key of NODE_TOPOLOGY_KEYS) {
		target[key] = source[key] as never;
	}
	syncOptionalProperties(target, source, OPTIONAL_NODE_TOPOLOGY_KEYS);
}

export function syncLinkTopologyData(target: LinkData, source: LinkData) {
	syncOptionalProperties(target, source, OPTIONAL_LINK_TOPOLOGY_KEYS);
}

export function resolveNodeStyle(
	context: GraphComponent,
	id: string,
	node: { exists: boolean; external: boolean; tags?: string[]; visited?: boolean; nodeStyle?: unknown },
) {
	let applicableStyles: NodeStyle[] = [context.config.nodeDefaultStyle as NodeStyle];

	if (node.external) {
		applicableStyles.push(context.config.nodeExternalStyle as NodeStyle);
	}

	if (node.visited) {
		applicableStyles.push(context.config.nodeVisitedStyle as NodeStyle);
	}

	if (context.config.tagRenderMode === 'same' || context.config.tagRenderMode === 'both') {
		for (const tag of node.tags ?? []) {
			const tagStyle = context.config.tagStyles[tag] as NodeStyle | undefined;
			if (tagStyle) {
				applicableStyles.push(tagStyle);
			}
		}
	}

	if (id === context.currentPage) {
		applicableStyles.push(context.config.nodeCurrentStyle as NodeStyle);
	}

	if (!node.exists) {
		applicableStyles.push(context.config.nodeUnresolvedStyle as NodeStyle);
	}

	if (node.nodeStyle) {
		applicableStyles.push(node.nodeStyle as NodeStyle);
	}

	return finalizeStyle(mergeNodeStyles(...applicableStyles));
}

export function resolveTagStyle(context: GraphComponent, tag: string) {
	return finalizeStyle(
		mergeNodeStyles(
			context.config.tagDefaultStyle as NodeStyle,
			(context.config.tagStyles[tag] ?? {}) as NodeStyle,
		),
	);
}

export function collectGraphColors(style: Partial<NodeStyle>, colors: GraphColorConfig) {
	for (const key of ['shapeColor', 'strokeColor', 'labelColor'] as const) {
		const styleColor = style[key];
		if (!styleColor) {
			continue;
		}

		let color = styleColor;
		if (!(color in cssVariablesMap) && color !== 'stroke' && color !== 'inherit') {
			color = Object.entries(colors).find(([, source]) => source === styleColor)?.[0]
				?? `nodeColorCustom${Object.keys(colors).filter(key => key.startsWith('nodeColorCustom')).length + 1}`;
			colors[color] ??= styleColor;
			style[key] = color;
		}

		if (color !== 'stroke' && color !== 'inherit') {
			colors[color] ??= color;
		}
	}

	for (const state of Object.values(style.states ?? {})) {
		if (!state) {
			continue;
		}

		collectGraphColors(state, colors);
	}
}

// TODO: different multiplier calculations
//			1. page size based multiplier
//			  - based on textLength or bytesLength of the page content
//			  - data gathered during sitemap generation

export function computeNeighborSizeMultiplier(context: GraphComponent, style: NodeStyle, neighborCount: number, distance?: number) {
	// EXPL: Artificially increases size of nodes that are closer to the current node
	const neighborSizeInput = (distance !== undefined && context.config.depth >= 0)
		? Math.max(neighborCount + 1, Math.round(NEIGHBORS_SIZE_DEPTH_BOOST / (distance + 1)))
		: Math.max(NEIGHBORS_SIZE_MIN_INPUT, neighborCount);

	const normalizedGrowth = Math.min(Math.max(
		(neighborSizeInput - NEIGHBORS_SIZE_MIN_NEIGHBORS) / (NEIGHBORS_SIZE_MAX_NEIGHBORS - NEIGHBORS_SIZE_MIN_NEIGHBORS)
	, 0), 1);

	return 1 + (style.sizingStrength ?? 0) * normalizedGrowth * (NEIGHBORS_SIZE_MULTIPLIER - 1);
}

export function computeNodeSizes(style: NodeStyle, sizeMultiplier: number) {
	const computedSize = style.shapeSize! * style.nodeScale! * sizeMultiplier;
	const fullRadius = computedSize + style.strokeWidth! / 2;
	const colliderSize = fullRadius * style.colliderScale!;

	return { computedSize, fullRadius, colliderSize };
}

export function getNodeDefaultStyle(style: NodeStyle) {
	const defaultStyle = { ...style };
	delete defaultStyle.states;
	return defaultStyle as NodeStyle;
}

export function createNodeVisualStates(style: NodeStyle) {
	const states = style.states;
	const defaultStyle = getNodeDefaultStyle(style);
	return Object.fromEntries(
		NODE_VISUAL_ROLES.map(role => {
			return [role, role === 'default' ? defaultStyle : { ...defaultStyle, ...(states?.[role] ?? {}) }]
		}),
	) as NodeVisualStyles;
}


export function resolveShapeCornerRadius(style: NodeStyle, computedSize: number) {
	if (style.cornerType !== 'round' && style.cornerType !== 'bevel') {
		return 0;
	}

	const baseRadius = style.shapeCornerRadius ?? DEFAULT_CORNER_RADIUS;
	const resolvedRadius =
		typeof baseRadius === 'string'
			? (parseFloat(baseRadius.slice(0, -1)) / 100) * computedSize
			: Number(baseRadius) * (computedSize / style.shapeSize!);

	// NOTE: Ensures that corner radius cannot exceed computed size
	return Math.min(Math.max(0, resolvedRadius), Math.max(0, computedSize - CORNER_RADIUS_EPSILON));
}

export function resolveStrokeCornerRadius(style: NodeStyle) {
	if (style.cornerType !== 'round' && style.cornerType !== 'bevel') {
		return 0;
	}

	const baseRadius = style.strokeCornerRadius ?? DEFAULT_CORNER_RADIUS;
	const resolvedRadius =
		typeof baseRadius === 'string'
			? (parseFloat(baseRadius.slice(0, -1)) / 100) * style.strokeWidth!
			: Number(baseRadius);

	return Math.min(Math.max(0, resolvedRadius), style.strokeWidth!);
}

function finalizeStyle(style: Partial<NodeStyle>): NodeStyle {
	style = ensureCorrectStyle(style);

	if (style.states) {
		style.states = Object.fromEntries(
			Object.entries(style.states).map(([state, stateStyle]) => {
				return [state, ensureCorrectStyle(stateStyle ?? {})]
			})
		) as NodeStateStyles;
	}

	return style;
}

function ensureCorrectStyle(style: Partial<NodeStyle | NodeStateStyle>) {
	style.sizingStrength = style.neighborScale ?? style.sizingStrength;

	// EXPL: Ensures default stroke properties if either is defined
	if (style.strokeColor && style.strokeColor !== 'inherit') {
		style.strokeWidth ??= DEFAULT_STROKE_WIDTH;
	} else if (style.strokeWidth) {
		style.strokeColor = 'inherit';
	}

	// EXPL: Ensures valid shape/strokeColor inheritance
	if (style.shapeColor === 'stroke') {
		if (style.strokeColor && style.strokeColor !== 'inherit') {
			style.shapeColor = style.strokeColor;
			style.strokeColor = 'inherit';
		} else {
			style.shapeColor = 'nodeColor';
		}
	}

	if (style.shapeRotation !== undefined) {
		style.shapeRotation = style.shapeRotation === 'random'
			? Math.random() * Math.PI * 2
			: (style.shapeRotation as number * Math.PI) / 180;
	}

	if (style.shape === 'star') {
		style.shapePoints ??= DEFAULT_STAR_POINTS;
	} else if (style.shape === 'polygon') {
		style.shapePoints ??= DEFAULT_POLYGON_POINTS;
	} else if (style.shape === 'square') {
		style.shapePoints = 4;
		style.shape = 'polygon';
		style.shapeRotation = (style.shapeRotation ?? 0) + Math.PI / 4;
	} else if (style.shape === 'triangle') {
		style.shapePoints = 3;
		style.shape = 'polygon';
		style.shapeRotation = (style.shapeRotation ?? 0) - Math.PI / 2;
	}

	return style;
}

function mergeNodeStyles(...styles: NodeStyle[]) {
	const merged: NodeStyle = {} as NodeStyle;
	for (const style of styles) {
		if (style) {
			Object.assign(merged, style);
			if (style.states) {
				merged.states = { ...(merged.states ?? {}) };
				for (const [state, stateStyle] of Object.entries(style.states)) {
					merged.states[state as keyof NodeStateStyles] = {
						...(merged.states[state as keyof NodeStateStyles] ?? {}),
						...stateStyle,
					};
				}
			}
		}
	}

	return merged;
}
