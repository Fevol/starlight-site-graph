export type NodeShapeType = 'circle' | 'square' | 'triangle' | 'polygon' | 'star';
export type NodeCornerType = 'normal' | 'round' | 'bevel';

export type NodeColorKeyword =
	| 'inherit'
	| 'backgroundColor'
	| 'nodeColor' | 'nodeColorHover' | 'nodeColorAdjacent' | 'nodeColorMuted'
	| 'nodeColorVisited' | 'nodeColorCurrent' | 'nodeColorUnresolved' | 'nodeColorExternal' | 'nodeColorTag'
	| 'nodeColor1' | 'nodeColor2' | 'nodeColor3' | 'nodeColor4' | 'nodeColor5'
	| 'nodeColor6' | 'nodeColor7' | 'nodeColor8' | 'nodeColor9'
	| 'linkColor' | 'linkColorHover' | 'linkColorMuted'
	| 'labelColor' | 'labelColorHover' | 'labelColorMuted';

export type NodeColorType = NodeColorKeyword | (string & {});

export type NodeStateStyle = {
	shape?: NodeShapeType | undefined;
	shapeSize?: number | undefined;
	shapeColor?: NodeColorType | 'stroke' | undefined;
	shapePoints?: number | undefined;
	shapeRotation?: number | 'random' | undefined;
	shapeCornerRadius?: number | string | undefined;
	cornerType?: NodeCornerType | undefined;
	strokeWidth?: number | undefined;
	strokeColor?: NodeColorType | 'inherit' | undefined;
	strokeCornerRadius?: number | string | undefined;
	labelOffset?: number | undefined;
	labelOpacity?: number | undefined;
	labelColor?: NodeColorType | undefined;
	labelScale?: number | undefined;
	nodeScale?: number | undefined;
	sizingStrength?: number | undefined;
	neighborScale?: number | undefined;
}

export type NodeStateStyles = {
	hovered?: NodeStateStyle | undefined;
	adjacent?: NodeStateStyle | undefined;
	muted?: NodeStateStyle | undefined;
}

export type NodeStyle = NodeStateStyle & {
	colliderScale?: number | undefined;
	states?: NodeStateStyles | undefined;
}

export type SitemapEntry = {
	external: boolean;
	exists: boolean;
	title: string;
	links?: string[] | undefined;
	backlinks?: string[] | undefined;
	tags?: string[] | undefined;
	visited?: boolean | undefined;
	nodeStyle?: Partial<NodeStyle> | undefined;
}

export type Sitemap = Record<string, SitemapEntry>;

export type GraphAction =
	| 'fullscreen' | 'depth' | 'reset-zoom'
	| 'render-arrows' | 'render-external' | 'render-unresolved' | 'settings';
export type TagRenderMode = 'none' | 'node' | 'same' | 'both';
export type ClickMode = 'auto' | 'disable' | 'click' | 'dblclick';
export type DepthDirection = 'both' | 'incoming' | 'outgoing';
export type FollowLinkMode = 'same' | 'new-tab' | 'graph';
export type EasingType = 'in_quad' | 'out_quad' | 'in_out_quad' | 'linear';
export type NodeSizeBy = 'neighbors';

export type GraphConfig = {
	actions: GraphAction[];
	tagStyles: Record<string, Partial<NodeStyle>>;
	tagRenderMode: TagRenderMode;
	prefetchPages: boolean;

	enableDrag: boolean;
	enableZoom: boolean;
	enablePan: boolean;
	enableHover: boolean;
	enableClick: ClickMode;

	nodeInclusionRules: string[];
	depth: number;
	depthDirection: DepthDirection;
	followLink: FollowLinkMode;
	nodeSizeBy: NodeSizeBy;

	scale: number;
	minZoom: number;
	maxZoom: number;
	zoomStep: number;

	renderLabels: boolean;
	renderArrows: boolean;
	renderUnresolved: boolean;
	renderExternal: boolean;

	scaleNodes: number;
	scaleLinks: boolean;
	scaleArrows: boolean;
	minZoomArrows: number;

	labelZoomOpacityScale: number;
	labelColor?: string | undefined;
	labelHoverColor?: string | undefined;
	labelAdjacentColor?: string | undefined;
	labelMutedColor?: string | undefined;
	labelMutedOpacity: number;
	labelHoverOpacity: number;
	labelAdjacentOpacity: number;
	labelFontSize: number;
	labelHoverScale: number;
	labelOffset: number;
	labelHoverOffset: number;
	labelOpacityScale?: number | undefined;

	zoomDuration: number;
	panDuration: number;
	zoomEase: EasingType;
	hoverDuration: number;
	hoverEase: EasingType;
	smoothTransitions: boolean;

	nodeDefaultStyle?: Partial<NodeStyle> | undefined;
	nodeVisitedStyle?: Partial<NodeStyle> | undefined;
	nodeCurrentStyle?: Partial<NodeStyle> | undefined;
	nodeUnresolvedStyle?: Partial<NodeStyle> | undefined;
	nodeExternalStyle?: Partial<NodeStyle> | undefined;
	tagDefaultStyle?: Partial<NodeStyle> | undefined;

	linkWidth: number;
	linkHoverWidth: number;

	arrowSize: number;
	arrowAngle: number;

	centerForce: number;
	colliderPadding: number;
	repelForce: number;
	linkDistance: number;
	alphaDecay: number;
}
