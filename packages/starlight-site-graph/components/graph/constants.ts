import type { ConfigKey } from './types';

export const MAX_DEPTH = 6;
export const FULL_GRAPH_DEPTH = MAX_DEPTH - 1;

export const GRAPH_EPSILON = 1e-6;
export const SIMULATION_CONFIG_RESTART_ALPHA = 0.12;
export const CONFIG_CHANGE_EVENT = 'slsg-config-change';
export const CONFIG_CHANGE_EVENT_DELAY_MS = 20;

export const STYLE_REFRESH_KEYS = new Set<ConfigKey>([
	'labelColor',
	'labelHoverColor',
	'labelAdjacentColor',
	'labelMutedColor',
	'labelFontSize',
	'nodeDefaultStyle',
	'nodeVisitedStyle',
	'nodeCurrentStyle',
	'nodeUnresolvedStyle',
	'nodeExternalStyle',
	'tagDefaultStyle',
	'tagStyles',
]);

export const TOPOLOGY_REFRESH_KEYS = new Set<ConfigKey>([
	'renderUnresolved',
	'renderExternal',
	'depth',
	'depthDirection',
	'nodeSizeBy',
	'tagRenderMode',
	'nodeInclusionRules',
]);

export const SIMULATION_UPDATE_KEYS = new Set<ConfigKey>([
	'colliderPadding',
	'repelForce',
	'centerForce',
	'linkDistance',
	'alphaDecay',
]);

export const TRANSITION_SYNC_KEYS = new Set<ConfigKey>([
	'smoothTransitions',
	'renderArrows',
	'scaleNodes',
	'scaleLinks',
	'scaleArrows',
	'minZoomArrows',
	'labelMutedOpacity',
	'labelHoverOpacity',
	'labelAdjacentOpacity',
	'linkWidth',
	'linkHoverWidth',
	'arrowSize',
	'arrowAngle',
	'zoomDuration',
	'panDuration',
	'zoomEase',
	'hoverDuration',
	'hoverEase',
]);

export const VISUAL_RENDER_KEYS = new Set<ConfigKey>(['labelOffset', 'labelHoverOffset', 'labelHoverScale']);
export const LABEL_OPACITY_KEYS = new Set<ConfigKey>(['labelZoomOpacityScale', 'labelOpacityScale']);
export const ZOOM_CONSTRAINT_KEYS = new Set<ConfigKey>(['minZoom', 'maxZoom']);
export const INTERACTION_KEYS = new Set<ConfigKey>(['enableDrag', 'enableZoom', 'enablePan', 'enableHover', 'enableClick']);
export const ACTION_UI_KEYS = new Set<ConfigKey>(['actions', 'depth', 'renderExternal', 'renderUnresolved', 'renderArrows']);
export const PASSIVE_CONFIG_KEYS = new Set<ConfigKey>(['followLink', 'prefetchPages', 'zoomStep']);

export const KNOWN_CONFIG_KEYS = new Set<ConfigKey>([
	...STYLE_REFRESH_KEYS,
	...TOPOLOGY_REFRESH_KEYS,
	...SIMULATION_UPDATE_KEYS,
	...TRANSITION_SYNC_KEYS,
	...VISUAL_RENDER_KEYS,
	...LABEL_OPACITY_KEYS,
	...ZOOM_CONSTRAINT_KEYS,
	...INTERACTION_KEYS,
	...ACTION_UI_KEYS,
	...PASSIVE_CONFIG_KEYS,
	'renderLabels',
	'scale',
]);
