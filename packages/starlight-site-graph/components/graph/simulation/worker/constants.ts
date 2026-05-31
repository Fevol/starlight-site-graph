export const NODE_BYTES     = 24;   // float x, y, vx, vy, shape size, collider size
export const LINK_BYTES     = 12;   // int source, target; float bias
export const CELL_BYTES     = 16;   // float cx, cy; int count, _pad
export const QUAD_CTX_BYTES = 32;   // 8*4-byte fields for Barnes-Hut traversal context

export const WASM_PAGE_BYTES = 65536;
export const WASM_MEMORY_SLACK_BYTES = 1024;
export const WORKER_TICK_INTERVAL_MS = 1000 / 60;

export const DEFAULT_ALPHA = 1.0;
export const DEFAULT_ALPHA_TARGET = 0.0;
export const DEFAULT_ALPHA_DECAY = 0.0228; // d3 default ~= 1 - 0.001^(1/300)
export const DEFAULT_ALPHA_MIN = 0.001;
export const DEFAULT_VELOCITY_DECAY = 0.6;
export const DEFAULT_CENTER_STRENGTH = 0.1;
export const DEFAULT_LINK_STRENGTH = 1.0;
export const DEFAULT_LINK_DISTANCE = 250;
export const DEFAULT_REPEL_STRENGTH = -1000;
export const DEFAULT_THETA = 0.9; // Barnes-Hut approximation threshold
export const DEFAULT_COLLISION_STRENGTH = 0.5;
