import type { NumericConfigKey } from '../types';

export const CHARGE_FORCE_SLIDER_MIN = 0;
export const CHARGE_FORCE_SLIDER_MAX = 2000;
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

// NOTE: Extracted here to simplify future i18n efforts.
export const ACTION_LABELS = {
	depth: {
		0: 'Show Only Current',
		1: 'Show Adjacent',
		2: 'Show Distance 2',
		3: 'Show Distance 3',
		4: 'Show Distance 4',
		5: 'Show Entire Graph',
	},
	fullscreen: {
		enter: 'Enter Fullscreen',
		exit: 'Exit Fullscreen',
	},
	arrows: {
		render: 'Render Arrows',
		hide: 'Render Lines',
	},
	external: {
		show: 'Show External Pages',
		hide: 'Hide External Pages',
	},
	unresolved: {
		show: 'Show Unresolved Pages',
		hide: 'Hide Unresolved Pages',
	},
	resetZoom: 'Reset Zoom',
	settings: 'Show Settings',
};

export const SETTINGS_SLIDERS = [
	['Repel Force', 'repelForce', CHARGE_FORCE_SLIDER_MIN, CHARGE_FORCE_SLIDER_MAX, CHARGE_FORCE_SLIDER_STEP],
	['Center Force', 'centerForce', CENTER_FORCE_SLIDER_MIN, CENTER_FORCE_SLIDER_MAX, CENTER_FORCE_SLIDER_STEP],
	['Collider Padding', 'colliderPadding', COLLIDER_PADDING_SLIDER_MIN, COLLIDER_PADDING_SLIDER_MAX, COLLIDER_PADDING_SLIDER_STEP],
	['Link Distance', 'linkDistance', LINK_DISTANCE_SLIDER_MIN, LINK_DISTANCE_SLIDER_MAX, LINK_DISTANCE_SLIDER_STEP],
	['Alpha Decay', 'alphaDecay', ALPHA_DECAY_SLIDER_MIN, ALPHA_DECAY_SLIDER_MAX, ALPHA_DECAY_SLIDER_STEP],
] satisfies Array<[string, NumericConfigKey, number, number, number]>;
