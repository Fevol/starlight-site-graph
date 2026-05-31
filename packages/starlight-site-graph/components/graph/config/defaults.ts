import type {
	GraphAction, ClickMode, DepthDirection, EasingType, FollowLinkMode,
	GraphConfig, NodeColorType, NodeShapeType, NodeStateStyles, NodeSizeBy, TagRenderMode,
} from './types';

export const nodeDefaultStyle = {
	shape: "circle" as NodeShapeType,
	shapeColor: "nodeColor" as NodeColorType,
	shapeSize: 6,
	shapePoints: undefined as number | undefined,
	shapeRotation: undefined as number | "random" | undefined,
	shapeCornerRadius: undefined as number | string | undefined,
	strokeWidth: 0,
	strokeColor: undefined as NodeColorType | "inherit" | undefined,
	strokeCornerRadius: undefined as number | string | undefined,
	labelOffset: 10,
	labelOpacity: 1,
	labelColor: undefined as NodeColorType | undefined,
	labelScale: 1,
	cornerType: undefined as "normal" | "round" | "bevel" | undefined,
	colliderScale: 1,
	nodeScale: 1,
	sizingStrength: 0.5,
	states: {
		hovered: {
			shapeColor: "nodeColorHover" as NodeColorType,
			strokeColor: "inherit" as NodeColorType | "inherit",
			labelOffset: 14, labelOpacity: 1, labelColor: undefined as NodeColorType | undefined, labelScale: 1
		},
		adjacent: {
			shapeColor: "nodeColorAdjacent" as NodeColorType,
			strokeColor: "inherit" as NodeColorType | "inherit",
			labelOffset: 10, labelOpacity: 0, labelColor: undefined as NodeColorType | undefined
		},
		muted: {
			shapeColor: "nodeColorMuted" as NodeColorType,
			strokeColor: "inherit" as NodeColorType | "inherit",
			labelOffset: 10, labelOpacity: 0, labelColor: undefined as NodeColorType | undefined
		},
	} as NodeStateStyles,
};

export const nodeVisitedStyle = { shapeColor: "nodeColorVisited" as NodeColorType };

export const nodeCurrentStyle = { shapeColor: "nodeColorCurrent" as NodeColorType };

export const nodeUnresolvedStyle = { shapeColor: "nodeColorUnresolved" as NodeColorType };

export const nodeExternalStyle = {
	shape: "square" as NodeShapeType,
	shapeColor: "nodeColorExternal" as NodeColorType,
	strokeColor: "inherit" as NodeColorType,
	nodeScale: 0.8
};

export const tagDefaultStyle = {
	shape: 'circle' as NodeShapeType,
	shapeSize: 6,
	shapeColor: 'backgroundColor' as NodeColorType,
	strokeColor: "nodeColorTag" as NodeColorType,
	strokeWidth: 1,
	labelOffset: 10,
	labelOpacity: 1,
	labelColor: undefined as NodeColorType | undefined,
	labelScale: 1,
	colliderScale: 1,
	nodeScale: 1,
	sizingStrength: 0.7,
	states: {
		hovered: { shapeColor: "nodeColorHover" as NodeColorType, strokeColor: "inherit" as NodeColorType | "inherit", labelOffset: 14, labelOpacity: 1, labelColor: undefined as NodeColorType | undefined, labelScale: 1 },
		adjacent: { shapeColor: "nodeColorAdjacent" as NodeColorType, strokeColor: "inherit" as NodeColorType | "inherit", labelOffset: 10, labelOpacity: 0, labelColor: undefined as NodeColorType | undefined, labelScale: 1 },
		muted: { shapeColor: "nodeColorMuted" as NodeColorType, strokeColor: "inherit" as NodeColorType | "inherit", labelOffset: 10, labelOpacity: 0, labelColor: undefined as NodeColorType | undefined, labelScale: 1 },
	} as NodeStateStyles,
};

export const defaultGraphConfig: GraphConfig = {
	actions: ['fullscreen', 'depth', 'reset-zoom', 'render-arrows', 'settings'] as GraphAction[],
	tagStyles: {},
	tagRenderMode: 'none' as TagRenderMode,
	nodeInclusionRules: ['**/*'],
	prefetchPages: true,
	enableDrag: true,
	enableZoom: true,
	enablePan: true,
	enableHover: true,
	enableClick: 'auto' as ClickMode,
	depth: 1,
	depthDirection: 'both' as DepthDirection,
	followLink: 'same' as FollowLinkMode,
	nodeSizeBy: 'neighbors' as NodeSizeBy,
	scale: 1,
	minZoom: 0.05,
	maxZoom: 4,
	zoomStep: 0.002,
	renderLabels: true,
	renderArrows: false,
	renderUnresolved: false,
	renderExternal: true,
	scaleNodes: 1,
	scaleLinks: true,
	scaleArrows: true,
	minZoomArrows: 0.8,
	labelZoomOpacityScale: 1,
	labelColor: undefined as string | undefined,
	labelHoverColor: undefined as string | undefined,
	labelAdjacentColor: undefined as string | undefined,
	labelMutedColor: undefined as string | undefined,
	labelMutedOpacity: 0,
	labelHoverOpacity: 1,
	labelAdjacentOpacity: 0,
	labelFontSize: 12,
	labelHoverScale: 1,
	labelOffset: 10,
	labelHoverOffset: 14,
	zoomDuration: 200,
	panDuration: 75,
	zoomEase: 'out_quad' as EasingType,
	hoverDuration: 200,
	hoverEase: 'out_quad' as EasingType,
	smoothTransitions: true,
	nodeDefaultStyle: nodeDefaultStyle,
	nodeVisitedStyle: nodeVisitedStyle,
	nodeCurrentStyle: nodeCurrentStyle,
	nodeUnresolvedStyle: nodeUnresolvedStyle,
	nodeExternalStyle: nodeExternalStyle,
	tagDefaultStyle: tagDefaultStyle,
	linkWidth: 1,
	linkHoverWidth: 1,
	arrowSize: 5,
	arrowAngle: Math.PI / 6,
	centerForce: 0.1,
	colliderPadding: 20,
	repelForce: 1000,
	linkDistance: 30,
	alphaDecay: 0.0228,
};
