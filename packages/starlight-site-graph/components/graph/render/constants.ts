// EXPL: Determines drawing order; higher means drawn on top
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

export const DEFAULT_ARROW_SCALE = 1.5;
export const SHAPE_STAR_LINE_DEPTH = 0.5;

export const MAX_INITIALIZATIONS_PER_FRAME = 50;
export const MAX_DISPOSALS_PER_FRAME = 100;

export const RENDERER_DEFAULT_RESOLUTION = 4;
export const RENDERER_LARGE_GRAPH_RESOLUTION = 2;
export const RENDERER_LARGE_GRAPH_NODE_THRESHOLD = 5000;
export const RENDERER_MAX_BACKING_DIMENSION = 4096;
export const RENDERER_MAX_BACKING_PIXELS = 4096 * 4096;
export const RENDERER_LABEL_MAX_RESOLUTION = 3;

export const SHAPE_MORPH_SAMPLES = 72;

export const MIN_RENDER_ZOOM = 0.001;
export const MIN_VISIBLE_ALPHA = 0.001;

export const NODE_VIEWPORT_PADDING = 160;
export const NODE_LABEL_VIEWPORT_PADDING = 48;
export const NODE_VISIBILITY_PADDING = 24;
export const LINK_VIEWPORT_PADDING = 120;
export const LABEL_CULL_NODE_COUNT = 300;
export const LABEL_CULL_ZOOM = 1.5;

export const UNSCALED_ARROW_ZOOM = 2;
export const ARROW_TRIM_SCALE = 0.9;

// EXPL: Durations for transitions that are _non_ hover related.
export const TOPOLOGY_TRANSITION_DURATION_MS = 180;
export const LIFECYCLE_TRANSITION_DURATION_MS = 120;
export const PALETTE_TRANSITION_DURATION_MS = 200;

export const DEBUG_STATS_LOAD_DELAY_MS = 500;
