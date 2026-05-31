import type { LinkData, NodeData, NodeVisualRole } from '../types';

export const NODE_VISUAL_ROLES = ['default', 'hovered', 'adjacent', 'muted'] as const satisfies readonly NodeVisualRole[];

export const DEFAULT_STROKE_WIDTH = 8;
export const DEFAULT_POLYGON_POINTS = 3;
export const DEFAULT_STAR_POINTS = 5;
export const DEFAULT_CORNER_RADIUS = 2;
export const CORNER_RADIUS_EPSILON = 0.001;

export const TOPOLOGY_RESTART_ALPHA_MIN = 0.03;
export const TOPOLOGY_RESTART_ALPHA_MAX = 0.25;
export const TOPOLOGY_GEOMETRY_RESTART_ALPHA = 0.05;

// EXPL: The minimum number of neighbors a node has when distance-based boosting is not applied.
export const NEIGHBORS_SIZE_MIN_INPUT = 1;
// EXPL: Adds synthetic neighbors to the current neighbor count based on the node's depth distance from the current node.
// 		 In effect, this scales up nodes closer to current node to give them more prominence.
export const NEIGHBORS_SIZE_DEPTH_BOOST = 30;
// EXPL: Amount of neighbors required to start applying the size ramp multiplier to the neighbor size
export const NEIGHBORS_SIZE_MIN_NEIGHBORS = 6;
// EXPL: Amount of neighbors at which the size ramp multiplier reaches its maximum value
export const NEIGHBORS_SIZE_MAX_NEIGHBORS = 80;
// EXPL: Maximum multiplier that can be applied to the node size based on the number of its neighbors
export const NEIGHBORS_SIZE_MULTIPLIER = 3.75;

export const NODE_TOPOLOGY_KEYS = [
	'exists',
	'external',
	'adjacent',
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
	'colliderScale',
	'nodeScale',
	'sizingStrength',
	'cornerType',
	'visualStates',
] satisfies Array<keyof NodeData>;

export const OPTIONAL_NODE_TOPOLOGY_KEYS = [
	'text',
	'tags',
	'type',
	'sizeMultiplier',
	'neighborScale',
	'depthDistance',
	'visibleInGraph',
	'states',
	'computedSize',
	'fullRadius',
	'colliderSize',
] satisfies Array<keyof NodeData>;

export const OPTIONAL_LINK_TOPOLOGY_KEYS = [
	'depthDistance',
	'visibleInGraph'
] satisfies Array<keyof LinkData>;
