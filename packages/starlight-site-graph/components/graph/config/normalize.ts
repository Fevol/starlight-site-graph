import type { GraphConfig, NodeStyle, NodeStateStyle } from './types';
import { ensureRecord, isRecord } from '../shared/object';

export function normalizeLegacyLabelConfig(config: unknown): void {
	if (!isRecord(config)) {
		return;
	}

	if ('labelOpacityScale' in config && !('labelZoomOpacityScale' in config)) {
		config['labelZoomOpacityScale'] = config['labelOpacityScale'];
	}

	const nodeDefaultStyle = ensureRecord(config, 'nodeDefaultStyle');
	const stateStyles = ensureRecord(nodeDefaultStyle, 'states');
	const hovered = ensureRecord(stateStyles, 'hovered');
	const adjacent = ensureRecord(stateStyles, 'adjacent');
	const muted = ensureRecord(stateStyles, 'muted');

	if ('labelOffset' in config) nodeDefaultStyle['labelOffset'] = config['labelOffset'];
	if ('labelColor' in config) nodeDefaultStyle['labelColor'] = config['labelColor'];
	if ('labelHoverOffset' in config) hovered['labelOffset'] = config['labelHoverOffset'];
	if ('labelHoverScale' in config) hovered['labelScale'] = config['labelHoverScale'];
	if ('labelHoverColor' in config) hovered['labelColor'] = config['labelHoverColor'];
	if ('labelAdjacentColor' in config) adjacent['labelColor'] = config['labelAdjacentColor'];
	if ('labelMutedColor' in config) muted['labelColor'] = config['labelMutedColor'];
	if ('labelHoverOpacity' in config) hovered['labelOpacity'] = config['labelHoverOpacity'];
	if ('labelAdjacentOpacity' in config) adjacent['labelOpacity'] = config['labelAdjacentOpacity'];
	if ('labelMutedOpacity' in config) muted['labelOpacity'] = config['labelMutedOpacity'];
}

function resolveRotation(state: NodeStateStyle): void {
	if (state.shapeRotation === 'random') {
		state.shapeRotation = Math.random() * 360;
	}
}

export function visitNodeStyleStates(style: Partial<NodeStyle> | undefined, apply: (state: NodeStateStyle) => void): void {
	if (style) {
		apply(style);
		if (style.states?.hovered) apply(style.states.hovered);
		if (style.states?.adjacent) apply(style.states.adjacent);
		if (style.states?.muted) apply(style.states.muted);
	}
}


export function visitGraphConfigStyles(config: Partial<GraphConfig>, apply: (state: NodeStateStyle) => void): void {
	visitNodeStyleStates(config.nodeDefaultStyle, apply);
	visitNodeStyleStates(config.nodeVisitedStyle, apply);
	visitNodeStyleStates(config.nodeCurrentStyle, apply);
	visitNodeStyleStates(config.nodeUnresolvedStyle, apply);
	visitNodeStyleStates(config.nodeExternalStyle, apply);
	visitNodeStyleStates(config.tagDefaultStyle, apply);
	if (config.tagStyles) {
		for (const style of Object.values(config.tagStyles)) {
			visitNodeStyleStates(style, apply);
		}
	}
}

export function normalizeRandomRotation(config: Partial<GraphConfig>): void {
	visitGraphConfigStyles(config, resolveRotation);
}
