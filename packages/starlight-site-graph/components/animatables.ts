import type { GraphConfig } from '../config';
import { HOVER_DURATION, HOVER_EASER, LABEL_OFFSET, ZOOM_DURATION, ZOOM_EASER } from './constants';
import type { AnimatedValues } from './types';
import { ColorInterpolator, NumberInterpolator, type AnimationConfig } from './animator';

export const animatables = (graphConfig: GraphConfig) => {
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
			properties: { default: graphConfig.regularNodeColor, blur: graphConfig.unhoveredNodeColor },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		nodeColorHover: {
			properties: { default: graphConfig.regularNodeColor, hover: graphConfig.hoveredNodeColor },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		visitedNodeColor: {
			properties: { default: graphConfig.visitedNodeColor, blur: graphConfig.unhoveredNodeColor },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		visitedNodeColorHover: {
			properties: { default: graphConfig.visitedNodeColor, hover: graphConfig.hoveredNodeColor },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		currentNodeColor: {
			properties: { default: graphConfig.currentNodeColor, blur: graphConfig.unhoveredNodeColor },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		currentNodeColorHover: {
			properties: { default: graphConfig.currentNodeColor, hover: graphConfig.hoveredNodeColor },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},

		nodeOpacity: {
			properties: { default: graphConfig.regularNodeOpacity, blur: graphConfig.unhoveredNodeOpacity },
			interpolator: new NumberInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		nodeOpacityHover: {
			properties: { default: graphConfig.regularNodeOpacity, hover: graphConfig.hoveredNodeOpacity },
			interpolator: new NumberInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},

		linkColor: {
			properties: { default: graphConfig.regularLinkColor, blur: graphConfig.unhoveredLinkColor },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		linkColorHover: {
			properties: { default: graphConfig.regularLinkColor, hover: graphConfig.hoveredLinkColor },
			interpolator: new ColorInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		linkOpacity: {
			properties: { default: graphConfig.regularLinkOpacity, blur: graphConfig.unhoveredLinkOpacity },
			interpolator: new NumberInterpolator(),
			duration: HOVER_DURATION,
			easing: HOVER_EASER,
		},
		linkOpacityHover: {
			properties: { default: graphConfig.regularLinkOpacity, hover: graphConfig.hoveredLinkOpacity },
			interpolator: new NumberInterpolator(),
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
