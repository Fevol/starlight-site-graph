import type { GraphConfig } from '../config';
import type { AnimatedValues } from './types';
import {
	ColorInterpolator, NumberInterpolator,
	type AnimationConfig,
	EaseInQuad, EaseInOutQuad, EaseLinear, EaseOutQuad
} from './animator';
import type { GraphColorConfig } from '../color';


const easing_functions = {
	"in_quad": new EaseInQuad(),
	"out_quad": new EaseOutQuad(),
	"in_out_quad": new EaseInOutQuad(),
	"linear": new EaseLinear()
}

export const animatables = (graphConfig: GraphConfig, colorConfig: GraphColorConfig) => {
	return {
		zoom: {
			properties: { default: 1 },
			interpolator: new NumberInterpolator(),
			duration: graphConfig.zoomDuration,
			easing: easing_functions[graphConfig.zoomEase],
		},
		transformX: {
			properties: { default: 0 },
			interpolator: new NumberInterpolator(),
			duration: graphConfig.zoomDuration,
			easing: easing_functions[graphConfig.zoomEase],
		},
		transformY: {
			properties: { default: 0 },
			interpolator: new NumberInterpolator(),
			duration: graphConfig.zoomDuration,
			easing: easing_functions[graphConfig.zoomEase],
		},

		nodeColor: {
			properties: { default: colorConfig.nodeColor, blur: colorConfig.nodeColorMuted },
			interpolator: new ColorInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},
		nodeColorHover: {
			properties: { default: colorConfig.nodeColor, hover: colorConfig.nodeColorHover },
			interpolator: new ColorInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},
		visitedNodeColor: {
			properties: { default: colorConfig.nodeColorVisited, blur: colorConfig.nodeColorMuted },
			interpolator: new ColorInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},
		visitedNodeColorHover: {
			properties: { default: colorConfig.nodeColorVisited, hover: colorConfig.nodeColorHover },
			interpolator: new ColorInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},
		currentNodeColor: {
			properties: { default: colorConfig.nodeColorCurrent, blur: colorConfig.nodeColorMuted },
			interpolator: new ColorInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},
		currentNodeColorHover: {
			properties: { default: colorConfig.nodeColorCurrent, hover: colorConfig.nodeColorHover },
			interpolator: new ColorInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},

		linkColor: {
			properties: { default: colorConfig.linkColor, blur: colorConfig.linkColorMuted },
			interpolator: new ColorInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},
		linkColorHover: {
			properties: { default: colorConfig.linkColor, hover: colorConfig.linkColorHover },
			interpolator: new ColorInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},

		labelOpacity: {
			properties: { default: 1, blur: 0 },
			interpolator: new NumberInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},
		labelOpacityHover: {
			properties: { default: 1, hover: 1 },
			interpolator: new NumberInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},

		labelOffset: {
			properties: { default: graphConfig.labelOffset, hover: graphConfig.labelHoverOffset },
			interpolator: new NumberInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},
		labelColorHover: {
			properties: { default: colorConfig.labelColor, hover: colorConfig.labelColorHover },
			interpolator: new ColorInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},
	} as const satisfies Record<keyof AnimatedValues, AnimationConfig<unknown>>;
};
