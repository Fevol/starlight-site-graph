import type { GraphConfig } from '../../config';
import type { AnimatedValues } from './types';
import {
	ColorInterpolator,
	NumberInterpolator,
	type AnimationConfig,
	EaseInQuad,
	EaseInOutQuad,
	EaseLinear,
	EaseOutQuad,
} from '../animator';
import type { GraphColorConfig } from '../../color';

const easing_functions = {
	in_quad: new EaseInQuad(),
	out_quad: new EaseOutQuad(),
	in_out_quad: new EaseInOutQuad(),
	linear: new EaseLinear(),
};

export const animated_colors = [
	'backgroundColor',
	'nodeColor',
	'nodeColorVisited',
	'nodeColorCurrent',
	'nodeColorUnresolved',
	'nodeColorTag',
	'nodeColor1',
	'nodeColor2',
	'nodeColor3',
	'nodeColor4',
	'nodeColor5',
	'nodeColor6',
	'nodeColor7',
	'nodeColor8',
	'nodeColor9',
	'linkColor',
	'labelColor',
] as const;

export const animatables = (graphConfig: GraphConfig, colorConfig: GraphColorConfig) => {
	return {
		zoom: {
			properties: { default: graphConfig.scale },
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

		...Object.fromEntries(
			animated_colors.flatMap(color => {
				const key = color.slice(0, color.indexOf('Color') + 5);
				return [
					[
						`${color}`,
						{
							properties: {
								default: colorConfig[color],
								blur: colorConfig[(key + 'Muted') as keyof typeof colorConfig] ?? colorConfig[color],
							},
							interpolator: new ColorInterpolator(),
							duration: graphConfig.hoverDuration,
							easing: easing_functions[graphConfig.hoverEase],
						},
					],
					[
						`${color}Hover`,
						{
							properties: {
								default: colorConfig[color],
								hover: colorConfig[(key + 'Hover') as keyof typeof colorConfig] ?? colorConfig[color],
							},
							interpolator: new ColorInterpolator(),
							duration: graphConfig.hoverDuration,
							easing: easing_functions[graphConfig.hoverEase],
						},
					],
				];
			}),
		),

		labelOpacity: {
			properties: { default: 1, blur: graphConfig.labelBlurOpacity },
			interpolator: new NumberInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},
		labelOpacityHover: {
			properties: { default: 1, hover: graphConfig.labelHoverOpacity },
			interpolator: new NumberInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},
		linkHoverWidth: {
			properties: { default: graphConfig.linkWidth, hover: graphConfig.linkHoverWidth },
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
	} as const satisfies Record<keyof AnimatedValues, AnimationConfig<unknown>>;
};
