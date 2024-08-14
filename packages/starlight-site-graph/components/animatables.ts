import type { GraphConfig } from '../config';
import { HOVER_DURATION, HOVER_EASER, LABEL_OFFSET, ZOOM_DURATION, ZOOM_EASER } from './constants';
import type { AnimatedValues } from './types';
import { ColorInterpolator, NumberInterpolator, type AnimationConfig } from './animator';
import type { GraphColorConfig } from '../color';

export const animatables = (graphConfig: GraphConfig, colorConfig: GraphColorConfig) => {
	return {
		zoom: {
			properties: { default: 1 },
			interpolator: new NumberInterpolator(),
			duration: ZOOM_DURATION,
			easing: ZOOM_EASER,
		},
		transformX: {
			properties: { default: 0 },
			interpolator: new NumberInterpolator(),
			duration: ZOOM_DURATION,
			easing: ZOOM_EASER,
		},
		transformY: {
			properties: { default: 0 },
			interpolator: new NumberInterpolator(),
			duration: ZOOM_DURATION,
			easing: ZOOM_EASER,
		},

		nodeColor: {
			properties: { default: colorConfig.nodeColor, blur: colorConfig.nodeColorMuted },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		nodeColorHover: {
			properties: { default: colorConfig.nodeColor, hover: colorConfig.nodeColorHover },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		visitedNodeColor: {
			properties: { default: colorConfig.nodeColorVisited, blur: colorConfig.nodeColorMuted },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		visitedNodeColorHover: {
			properties: { default: colorConfig.nodeColorVisited, hover: colorConfig.nodeColorHover },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		currentNodeColor: {
			properties: { default: colorConfig.nodeColorCurrent, blur: colorConfig.nodeColorMuted },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		currentNodeColorHover: {
			properties: { default: colorConfig.nodeColorCurrent, hover: colorConfig.nodeColorHover },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},

		linkColor: {
			properties: { default: colorConfig.linkColor, blur: colorConfig.linkColorMuted },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		linkColorHover: {
			properties: { default: colorConfig.linkColor, hover: colorConfig.linkColorHover },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},

		labelOpacity: {
			properties: { default: 1, blur: 0 },
			interpolator: new NumberInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		labelOpacityHover: {
			properties: { default: 1, hover: 1 },
			interpolator: new NumberInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},

		labelOffset: {
			properties: { default: LABEL_OFFSET, hover: LABEL_OFFSET + 4 },
			interpolator: new NumberInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
	} as const satisfies Record<keyof AnimatedValues, AnimationConfig<unknown>>;
};
