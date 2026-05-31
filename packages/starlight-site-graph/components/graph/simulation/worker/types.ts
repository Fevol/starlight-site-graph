export interface SimulationExports {
	init:     (nodes_base: number, node_count: number, link_count: number) => void;
	complete: (nodes_base: number, node_count: number, velocity_decay: number) => void;
	simulate: (nodes_base: number, node_count: number, link_count: number,
	           alpha: number, center_str: number, link_str: number, link_dist: number,
	           repel_str: number, theta: number, collision_str: number) => void;
}

interface BaseMessage {
	type: string;
}

export interface InitializeMessage extends BaseMessage {
	type: 'init';
	nodeCount: number;
	linkCount: number;
	positions: Float32Array;  // NOTE: formatted as [x0, y0, x1, y1, ...]
	colliderRadii: Float32Array;
	linkSrc: Int32Array;
	linkDst: Int32Array;
	alpha?: number;
}

export interface CollidersMessage extends BaseMessage {
	type: 'colliders';
	colliderRadii: Float32Array;
}

export interface ForcesMessage {
	type: 'forces';
	centerStrength?: number;
	linkStrength?: number;
	linkDistance?: number;
	repelStrength?: number;
	alphaDecay?: number;
	alphaTarget?: number;
	collisionStrength?: number;
	restartAlpha?: number;
}

export interface FixMessage {
	type: 'fix';
	index: number;
	x: number | null;
	y: number | null;
}

export interface RestartMessage {
	type: 'restart';
	alpha?: number
}

export interface StopMessage {
	type: 'stop'
}

export type WorkerMessage = InitializeMessage
	| CollidersMessage
	| ForcesMessage
	| FixMessage
	| RestartMessage
	| StopMessage;
