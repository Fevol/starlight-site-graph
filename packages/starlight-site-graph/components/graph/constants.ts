export const MAX_DEPTH = 6;

export const NODE_DEFAULT_Z_INDEX = 3;
export const NODE_HOVER_Z_INDEX = 10;
export const NODE_MUTED_Z_INDEX = 1;

export const STROKE_DEFAULT_Z_INDEX = 3;
export const STROKE_HOVER_Z_INDEX = 10;
export const STROKE_MUTED_Z_INDEX = 1;

export const LABEL_DEFAULT_Z_INDEX = 20;

export const LINK_DEFAULT_Z_INDEX = 0;
export const LINK_HOVER_Z_INDEX = 5;
export const LINK_MUTED_Z_INDEX = 0;
export const ARROW_DEFAULT_Z_INDEX = 2;
export const ARROW_HOVER_Z_INDEX = 7;
export const ARROW_MUTED_Z_INDEX = 0;

export const DEFAULT_STROKE_WIDTH = 8;
export const DEFAULT_POLYGON_POINTS = 3;
export const DEFAULT_STAR_POINTS = 5;
export const DEFAULT_CORNER_RADIUS = 2;
export const DEFAULT_ARROW_SCALE = 1.5;

export const STAR_LINE_DEPTH = 0.5;

export const CHARGE_FORCE_SLIDER_MIN = 0;
export const CHARGE_FORCE_SLIDER_MAX = 500;
export const CHARGE_FORCE_SLIDER_STEP = 1;

export const CENTER_FORCE_SLIDER_MIN = 0;
export const CENTER_FORCE_SLIDER_MAX = 1;
export const CENTER_FORCE_SLIDER_STEP = 0.01;

export const COLLIDER_PADDING_SLIDER_MIN = 0;
export const COLLIDER_PADDING_SLIDER_MAX = 100;
export const COLLIDER_PADDING_SLIDER_STEP = 1;

export const LINK_DISTANCE_SLIDER_MIN = 0;
export const LINK_DISTANCE_SLIDER_MAX = 500;
export const LINK_DISTANCE_SLIDER_STEP = 1;

export const ALPHA_DECAY_SLIDER_MIN = 0;
export const ALPHA_DECAY_SLIDER_MAX = 0.3;
export const ALPHA_DECAY_SLIDER_STEP = 0.001;

export const REQUIRE_SIMULATION_UPDATE = [
	'colliderPadding',
	'repelForce',
	'centerForce',
	'linkDistance',
	'alphaDecay'
];

export const REQUIRE_NOTHING = [
	'followLink',
]
export const REQUIRE_RENDER_UPDATE = [
	'renderArrows',

	'scaleLinks',
	'scaleArrows',
	'minZoomArrows',
	'labelHoverScale',
	'labelOffset',
	'labelHoverOffset',
	'labelMutedOpacity',
	'labelHoverOpacity',
	'labelAdjacentOpacity',

	'linkWidth',
	'linkHoverWidth',

	'arrowSize',
	'arrowAngle',

	'zoomDuration',
	'zoomEase',

	'hoverDuration',
	'hoverEase',
];
export const REQUIRE_ZOOM_UPDATE = [
	'scale',
];
export const REQUIRE_LABEL_UPDATE = [
	'labelOpacityScale',
];
export const REQUIRE_FULL_REFRESH = [
	'renderLabels',
	'renderUnresolved',
	'renderExternal',

	'labelFontSize',

	'enableDrag',
	'enableZoom',
	'enablePan',
	'enableHover',
	'enableClick',

	'depth',
	'depthDirection',

	'minZoom',
	'maxZoom',

	'nodeDefaultStyle',
	'nodeVisitedStyle',
	'nodeCurrentStyle',
	'nodeUnresolvedStyle',
	'nodeExternalStyle',
	'tagDefaultStyle',

	'tagStyles'
]
