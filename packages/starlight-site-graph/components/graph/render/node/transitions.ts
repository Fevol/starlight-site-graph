import type { NodeData, NodeVisualRole } from '../../types';
import type { NodeDisplay, NodeVisualState, TransitionKind } from '../types';
import type { Track } from '../track';
import type { GraphRenderer } from '../engine';

import { getNodeVisualRole } from './state';
import { deferNodeDisposal } from '../lifecycle';
import { computeNodeLabelState } from '../label/render';
import { easeTransition, fadeOutExiting, getTransitionDuration } from '../transitions';
import { numberChanged, retargetTrack, tickTrack } from '../track';
import { getNodeStyle, getNodeGeometryTargets, computeNodeShapeTint, computeNodeStrokeTint } from './style';
import { resolveShapeCornerRadius, resolveStrokeCornerRadius } from '../../topology/style';

import { lerpRGBNumber } from '../utils';


function animateScalar(
	track: Track<number>,
	target: number,
	renderer: GraphRenderer,
	hoverDriven: boolean,
	configKind: TransitionKind,
	deltaMS: number,
): boolean {
	const config = renderer.config;
	const kind: TransitionKind = hoverDriven ? 'interaction' : configKind;
	retargetTrack(track, target, getTransitionDuration(kind, config), numberChanged, kind);
	const activeKind = (track.kind as TransitionKind) ?? kind;
	return tickTrack(
		track,
		deltaMS,
		getTransitionDuration(activeKind, config),
		(source, tgt, progress) => source + (tgt - source) * easeTransition(activeKind, config, progress),
	);
}

function animateColor(track: Track<number>, target: number, renderer: GraphRenderer, hoverDriven: boolean, deltaMS: number): boolean {
	const config = renderer.config;
	const kind: TransitionKind = hoverDriven ? 'interaction' : 'palette';
	retargetTrack(track, target, getTransitionDuration(kind, config), numberChanged, kind);
	const activeKind = (track.kind as TransitionKind) ?? kind;
	return tickTrack(
		track,
		deltaMS,
		getTransitionDuration(activeKind, config),
		(source, tgt, progress) => lerpRGBNumber(source, tgt, easeTransition(activeKind, config, progress)),
	);
}

function normalizeRotationTarget(animated: Track<number>, rawTarget: number): number {
	const ref = animated.progress >= 1 ? animated.value : animated.source;
	let delta = rawTarget - ref;
	while (delta > Math.PI) {
		delta -= Math.PI * 2;
	}
	while (delta < -Math.PI) {
		delta += Math.PI * 2;
	}

	return ref + delta;
}

function animateNodeStyle(
	visual: NodeVisualState,
	display: NodeDisplay,
	node: NodeData,
	colorRole: NodeVisualRole,
	roleChanged: boolean,
	renderer: GraphRenderer,
	deltaMS: number,
): boolean {
	const effectiveStyle = getNodeStyle(node, colorRole);
	const colors = renderer.palette;
	const shapeTintTarget = computeNodeShapeTint(colors, node, colorRole);
	const strokeTintTarget = computeNodeStrokeTint(colors, node, colorRole, shapeTintTarget);
	const alphaTarget = 1;
	const offsetTarget = effectiveStyle.labelOffset ?? 0;

	const scaleTarget = Math.max(0, (effectiveStyle.labelScale ?? 1) - 1);

	let stillAnimating = false;
	if (animateColor(visual.shapeTint, shapeTintTarget, renderer, roleChanged, deltaMS)) {
		visual.styleDirty = true;
		stillAnimating = true;
	}
	if (animateColor(visual.strokeTint, strokeTintTarget, renderer, roleChanged, deltaMS)) {
		visual.styleDirty = true;
		stillAnimating = true;
	}
	if (animateScalar(visual.alpha, alphaTarget, renderer, roleChanged, 'topology', deltaMS)) {
		stillAnimating = true;
	}
	if (animateScalar(visual.labelOffset, offsetTarget, renderer, roleChanged, 'topology', deltaMS)) {
		stillAnimating = true;
	}
	if (animateScalar(visual.labelScale, scaleTarget, renderer, roleChanged, 'topology', deltaMS)) {
		stillAnimating = true;
	}

	if (display.label) {
		const labelDisplay = computeNodeLabelState(renderer, node, colorRole === 'hovered', colorRole === 'adjacent');
		if (animateScalar(visual.labelAlpha, labelDisplay.alpha, renderer, roleChanged, 'topology', deltaMS)) {
			stillAnimating = true;
		}
	}

	return stillAnimating;
}

function animateNodeGeometry(
	visual: NodeVisualState,
	node: NodeData,
	colorRole: NodeVisualRole,
	roleChanged: boolean,
	renderer: GraphRenderer,
	deltaMS: number,
): boolean {
	const effectiveStyle = getNodeStyle(node, colorRole);
	const geometryTarget = getNodeGeometryTargets(node, colorRole);
	const rotationTarget = normalizeRotationTarget(visual.renderedShapeRotation, Number(effectiveStyle.shapeRotation ?? 0));

	let stillAnimating = false;
	if (animateScalar(visual.renderedComputedSize, geometryTarget.computedSize, renderer, roleChanged, 'topology', deltaMS)) {
		visual.geometryDirty = true;
		stillAnimating = true;
	}
	if (animateScalar(visual.renderedFullRadius, geometryTarget.fullRadius, renderer, roleChanged, 'topology', deltaMS)) {
		visual.geometryDirty = true;
		stillAnimating = true;
	}
	if (animateScalar(visual.renderedShapeRotation, rotationTarget, renderer, roleChanged, 'topology', deltaMS)) {
		visual.geometryDirty = true;
		stillAnimating = true;
	}

	const cornerRadiusTarget = resolveShapeCornerRadius(effectiveStyle, geometryTarget.computedSize);
	const strokeCornerRadiusTarget = resolveStrokeCornerRadius(effectiveStyle);
	if (animateScalar(visual.renderedCornerRadius, cornerRadiusTarget, renderer, roleChanged, 'topology', deltaMS)) {
		visual.geometryDirty = true;
		stillAnimating = true;
	}
	if (animateScalar(visual.renderedStrokeCornerRadius, strokeCornerRadiusTarget, renderer, roleChanged, 'topology', deltaMS)) {
		visual.geometryDirty = true;
		stillAnimating = true;
	}

	const config = renderer.config;
	const shapeMorphKind = (visual.shapeMorph.kind as TransitionKind) ?? 'interaction';
	const strokeMorphKind = (visual.strokeMorph.kind as TransitionKind) ?? 'interaction';
	const shapeMorphing = visual.shapeMorph.tick(deltaMS, getTransitionDuration(shapeMorphKind, config));
	const strokeMorphing = visual.strokeMorph.tick(deltaMS, getTransitionDuration(strokeMorphKind, config));

	if (shapeMorphing || strokeMorphing) {
		visual.geometryDirty = true;
		stillAnimating = true;
	}

	return stillAnimating;
}

function syncNodeDisplay(display: NodeDisplay, visual: NodeVisualState): void {
	if (display.node) {
		display.node.alpha = visual.alpha.value;
		display.node.tint = visual.shapeTint.value;
	}
	if (display.stroke) {
		display.stroke.alpha = visual.alpha.value;
		display.stroke.tint = visual.strokeTint.value;
	}
}

export function updateNodeVisuals(renderer: GraphRenderer, nodes: NodeData[], deltaMS: number) {
	const hoveredId = renderer.simulator.currentlyHovered;

	let stillAnimating = false;
	for (const node of nodes) {
		const display = renderer.getNodeDisplay(node);
		const visual = renderer.getNodeVisual(node);
		if (!visual.rendered) {
			continue;
		}

		const colorRole = getNodeVisualRole(node, hoveredId);

		const roleChanged = visual.role !== colorRole;
		if (roleChanged) {
			visual.role = colorRole;
			visual.styleDirty = true;
		}

		if (
			!visual.animating &&
			!roleChanged &&
			!visual.geometryDirty &&
			!visual.styleDirty &&
			!visual.shapeMorph.active &&
			!visual.strokeMorph.active
		) {
			continue;
		}

		let nodeAnimating = false;
		if (animateNodeStyle(visual, display, node, colorRole, roleChanged, renderer, deltaMS)) {
			nodeAnimating = true;
			stillAnimating = true;
		}
		if (animateNodeGeometry(visual, node, colorRole, roleChanged, renderer, deltaMS)) {
			nodeAnimating = true;
			stillAnimating = true;
		}
		visual.animating = nodeAnimating;
		syncNodeDisplay(display, visual);
	}

	if (stillAnimating) {
		renderer.simulator.requestGraphDraw();
	}
}

export function updateExitingNodes(renderer: GraphRenderer, deltaMS: number) {
	fadeOutExiting(
		renderer,
		deltaMS,
		renderer.exitingNodeDisplays,
		(display, maxDelta) => {
			const visual = display.visual!;
			if (visual.alpha.value <= maxDelta) {
				return true;
			}
			visual.alpha.value -= maxDelta;
			if (display.node) {
				display.node.alpha = visual.alpha.value;
			}
			if (display.stroke) {
				display.stroke.alpha = visual.alpha.value;
			}
			if (display.label) {
				display.label.alpha = visual.alpha.value;
			}
			return false;
		},
		display => [display.node, display.stroke, display.label],
		deferNodeDisposal,
	);
}
