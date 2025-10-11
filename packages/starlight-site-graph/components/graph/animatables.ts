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

export const animatables = (graphConfig: GraphConfig, colorConfig: GraphColorConfig, usedColors: string[]) => {
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
			usedColors.flatMap(color => {
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
					[
						`${color}Adjacent`,
						{
							properties: {
								default: colorConfig[color],
								adjacent: colorConfig[(key + 'Adjacent') as keyof typeof colorConfig] ?? colorConfig[color],
							},
							interpolator: new ColorInterpolator(),
							duration: graphConfig.hoverDuration,
							easing: easing_functions[graphConfig.hoverEase],
						},
					]
				];
			}),
		),

		labelOpacity: {
			properties: { default: 1, blur: graphConfig.labelMutedOpacity },
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
		labelOpacityAdjacent: {
			properties: { default: 1, adjacent: graphConfig.labelAdjacentOpacity ?? graphConfig.labelMutedOpacity },
			interpolator: new NumberInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},
		labelScaleHover: {
			properties: { default: 1, hover: graphConfig.labelHoverScale },
			interpolator: new NumberInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},

		linkOpacityHover: {
			properties: { default: 0, hover: 1 },
			interpolator: new NumberInterpolator(),
			duration: graphConfig.hoverDuration,
			easing: easing_functions[graphConfig.hoverEase],
		},
		linkWidthHover: {
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
