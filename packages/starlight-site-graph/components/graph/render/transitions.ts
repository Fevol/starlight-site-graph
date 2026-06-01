import chroma from 'chroma-js';
import type { GraphColorConfig } from '../color';
import type { GraphRenderer } from './engine';
import type { GraphConfig } from '../config/types';
import type { ColorTrack, EasingId, NumberTrack, PanTransitionKind, TransitionKind } from './types';

import { GraphTransform } from '../transform';

import { createTrack, numberChanged, retargetTrack, tickTrack } from './track';
import { hideDisplayObjects } from './utils';

import { LIFECYCLE_TRANSITION_DURATION_MS, PALETTE_TRANSITION_DURATION_MS, TOPOLOGY_TRANSITION_DURATION_MS } from './constants';


const registry: Record<
	TransitionKind,
	{ duration: (config: GraphConfig) => number; easing: (config: GraphConfig) => EasingId }
> = {
	zoom: { duration: config => config.zoomDuration, easing: config => config.zoomEase },
	pan: { duration: config => config.panDuration, easing: config => config.zoomEase },
	interaction: { duration: config => config.hoverDuration, easing: config => config.hoverEase },
	visibility: {
		duration: config => (config.smoothTransitions ? config.hoverDuration : 0),
		easing: config => config.hoverEase,
	},
	topology: { duration: config => (config.smoothTransitions ? TOPOLOGY_TRANSITION_DURATION_MS : 0), easing: () => 'linear' },
	lifecycle: { duration: config => (config.smoothTransitions ? LIFECYCLE_TRANSITION_DURATION_MS : 0), easing: () => 'linear' },
	palette: { duration: config => (config.smoothTransitions ? PALETTE_TRANSITION_DURATION_MS : 0), easing: config => config.hoverEase },
};

const easing: Record<EasingId, (t: number) => number> = {
	in_quad: t => t * t,
	out_quad: t => 1 - (1 - t) * (1 - t),
	in_out_quad: t => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
	linear: t => t,
};


export function getTransitionDuration(kind: TransitionKind, config: GraphConfig) {
	return registry[kind].duration(config);
}

export function easeTransition(kind: TransitionKind, config: GraphConfig, progress: number) {
	return easing[registry[kind].easing(config)](progress);
}

function retargetNumber(track: NumberTrack, target: number, config: GraphConfig, kind: TransitionKind, immediate = false) {
	retargetTrack(track, target, immediate ? 0 : getTransitionDuration(kind, config), numberChanged);
}

function retargetColor(track: ColorTrack, target: string, config: GraphConfig, kind: TransitionKind, immediate = false) {
	retargetTrack(track, target, immediate ? 0 : getTransitionDuration(kind, config));
}

function tickNumber(track: NumberTrack, deltaMS: number, config: GraphConfig, kind: TransitionKind) {
	return tickTrack(track, deltaMS, getTransitionDuration(kind, config), (source, target, progress) =>
		source + (target - source) * easeTransition(kind, config, progress),
	);
}

function tickColor(track: ColorTrack, deltaMS: number, config: GraphConfig, kind: TransitionKind) {
	return tickTrack(track, deltaMS, getTransitionDuration(kind, config), (source, target, progress) =>
		chroma.mix(source, target, easeTransition(kind, config, progress), 'rgb').hex(),
	);
}

export function fadeOutExiting<D extends { visual?: object | undefined }>(
	renderer: GraphRenderer,
	deltaMS: number,
	exiting: Map<string, D>,
	advance: (display: D, maxDelta: number) => boolean,
	objectsOf: (display: D) => Array<{ visible: boolean } | undefined>,
	defer: (renderer: GraphRenderer, display: D) => void,
) {
	const duration = getTransitionDuration('lifecycle', renderer.config);
	const maxDelta = duration > 0 ? deltaMS / duration : Infinity;

	let stillAnimating = false;
	for (const [key, display] of exiting) {
		if (advance(display, maxDelta)) {
			exiting.delete(key);
			hideDisplayObjects(...objectsOf(display));
			defer(renderer, display);
			renderer.simulator.requestGraphDraw();
		} else {
			stillAnimating = true;
		}
	}

	if (stillAnimating) {
		renderer.simulator.requestGraphDraw();
	}
}

export class AnimationState {
	zoom = createTrack(1);
	transformX = createTrack(0);
	transformY = createTrack(0);
	labelsEnabled = createTrack(1);
	labelOpacity = createTrack(1);
	labelColor = createTrack('#ffffff');
	labelColorHover = createTrack('#ffffff');
	linkOpacityHover = createTrack(0);
	linkWidthHover = createTrack(1);
	linkColor = createTrack('#ffffff');
	linkColorHover = createTrack('#ffffff');
	linkColorMuted = createTrack('#ffffff');

	private hoverActive = false;
	private baseLabelOpacity = 1;
	private colors: GraphColorConfig | undefined;
	private panTransitionKind: PanTransitionKind = 'pan';

	destroy() {
		this.colors = undefined;
		for (const track of this.allTracks) {
			track.active = false;
			track.progress = 1;
		}
	}

	private get allTracks() {
		return [
			this.zoom,
			this.transformX,
			this.transformY,
			this.labelsEnabled,
			this.labelOpacity,
			this.linkOpacityHover,
			this.linkWidthHover,
			this.labelColor,
			this.labelColorHover,
			this.linkColor,
			this.linkColorHover,
			this.linkColorMuted,
		];
	}

	syncColors(colors: GraphColorConfig, config: GraphConfig, immediate = false) {
		this.colors = colors;

		retargetColor(this.labelColor, colors.labelColor ?? '#ffffff', config, 'palette', immediate);
		retargetColor(this.labelColorHover, colors.labelColorHover ?? colors.labelColor ?? '#ffffff', config, 'palette', immediate);

		retargetColor(this.linkColor, colors.linkColor ?? '#ffffff', config, 'palette', immediate);
		retargetColor(this.linkColorHover, colors.linkColorHover ?? colors.linkColor ?? '#ffffff', config, 'palette', immediate);
		retargetColor(this.linkColorMuted, colors.linkColorMuted ?? colors.linkColor ?? '#ffffff', config, 'palette', immediate);
	}

	setViewport(
		values: { zoom?: number; x?: number; y?: number },
		config: GraphConfig,
		immediate = false,
		panKind: PanTransitionKind = 'pan',
	) {
		if (values.x !== undefined || values.y !== undefined) {
			this.panTransitionKind = panKind;
		}
		if (values.zoom !== undefined) {
			retargetNumber(this.zoom, values.zoom, config, 'zoom', immediate);
		}
		if (values.x !== undefined) {
			retargetNumber(this.transformX, values.x, config, panKind, immediate);
		}
		if (values.y !== undefined) {
			retargetNumber(this.transformY, values.y, config, panKind, immediate);
		}
	}

	setLabelsEnabled(enabled: boolean, config: GraphConfig, immediate = false) {
		retargetNumber(this.labelsEnabled, enabled ? 1 : 0, config, 'visibility', immediate);
	}

	setLabelOpacityBase(opacity: number, config: GraphConfig, immediate = false) {
		this.baseLabelOpacity = opacity;
		this.syncInteractionTargets(config, immediate);
	}

	setHoverActive(active: boolean, config: GraphConfig, immediate = false) {
		this.hoverActive = active;
		this.syncInteractionTargets(config, immediate);
	}

	syncConfig(config: GraphConfig, immediate = false) {
		this.setLabelsEnabled(config.renderLabels, config, immediate);
		this.syncInteractionTargets(config, immediate);
		if (this.colors) this.syncColors(this.colors, config, immediate);
	}

	private syncInteractionTargets(config: GraphConfig, immediate = false) {
		retargetNumber(this.linkOpacityHover, this.hoverActive ? 1 : 0, config, 'interaction', immediate);
		retargetNumber(this.linkWidthHover, this.hoverActive ? config.linkHoverWidth : config.linkWidth, config, 'interaction', immediate);
		retargetNumber(this.labelOpacity, this.baseLabelOpacity, config, 'interaction', immediate);
	}

	tick(deltaMS: number, config: GraphConfig) {
		let active = false;
		for (const track of [
			this.zoom,
			this.transformX,
			this.transformY,
			this.labelsEnabled,
			this.labelOpacity,
			this.linkOpacityHover,
			this.linkWidthHover,
		]) {
			if (
				tickNumber(
					track,
					deltaMS,
					config,
					track === this.labelsEnabled
						? 'visibility'
						: track === this.zoom
							? 'zoom'
							: track === this.transformX || track === this.transformY
								? this.panTransitionKind
							: 'interaction',
				)
			) {
				active = true;
			}
		}
		if (tickColor(this.labelColor, deltaMS, config, 'palette')) {
			active = true;
		}
		if (tickColor(this.labelColorHover, deltaMS, config, 'palette')) {
			active = true;
		}
		if (tickColor(this.linkColor, deltaMS, config, 'palette')) {
			active = true;
		}
		if (tickColor(this.linkColorHover, deltaMS, config, 'palette')) {
			active = true;
		}
		if (tickColor(this.linkColorMuted, deltaMS, config, 'palette')) {
			active = true;
		}
		return active;
	}

	get anyAnimating() {
		return this.allTracks.some(track => track.active);
	}

	get drawAnimating() {
		return (
			this.zoom.active ||
			this.labelsEnabled.active ||
			this.labelOpacity.active ||
			this.linkOpacityHover.active ||
			this.linkWidthHover.active ||
			this.labelColor.active ||
			this.labelColorHover.active ||
			this.linkColor.active ||
			this.linkColorHover.active ||
			this.linkColorMuted.active
		);
	}

	get renderedTransform() {
		return new GraphTransform(this.zoom.value, this.transformX.value, this.transformY.value);
	}

	get cameraAnimating() {
		return this.zoom.active || this.transformX.active || this.transformY.active;
	}
}
