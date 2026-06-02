// NOTE: This script is heavily AI-coded. It will at some point need to be cleaned-up for better understandability.

import * as PIXI from 'pixi.js';

import type { NodeShapeType, NodeStyle } from '../../config/types';
import type { NodeData, NodeVisualRole } from '../../types';
import type { GraphRenderer } from '../engine';

import { getNodeStyle, getNodeGeometryValues } from './style';

import { SHAPE_MORPH_SAMPLES, SHAPE_STAR_LINE_DEPTH } from '../constants';
import { GRAPH_EPSILON } from '../../constants';

const CIRCLE_MORPH_OUTLINE = sampleRadialOutline(createShapeVertices('circle', SHAPE_MORPH_SAMPLES), SHAPE_MORPH_SAMPLES);

function createShapeVertices(shape: NodeShapeType, points: number) {
	if (shape === 'polygon') {
		return Array.from(
			{ length: points },
			(_, i) => [Math.cos((-Math.PI * 2 * i) / points), Math.sin((-Math.PI * 2 * i) / points)] as const,
		);
	}

	else if (shape === 'star') {
		return Array.from({ length: points * 2 }, (_, i) => {
			const angle = (Math.PI * 2 * i) / (2 * points);
			const radius = i % 2 === 0 ? 1 : SHAPE_STAR_LINE_DEPTH;
			return [Math.sin(angle) * radius, -Math.cos(angle) * radius] as const;
		});
	}

	else if (shape === 'circle') {
		return Array.from(
			{ length: points },
			(_, i) => {
				const angle = -(Math.PI * 2 * i) / points;
				return [Math.cos(angle), Math.sin(angle)] as const;
			},
		);
	}


	return [];
}

function sampleRadialOutline(path: ReadonlyArray<readonly [number, number]>, sampleCount: number) {
	const outline = new Float32Array(sampleCount * 2);

	for (let i = 0; i < sampleCount; i++) {
		const angle = -(Math.PI * 2 * i) / sampleCount;
		const dirX = Math.cos(angle);
		const dirY = Math.sin(angle);

		let bestDistance = Number.POSITIVE_INFINITY;
		for (let j = 0; j < path.length; j++) {
			const [x1, y1] = path[j]!;
			const [x2, y2] = path[(j + 1) % path.length]!;
			const segmentX = x2 - x1;
			const segmentY = y2 - y1;
			const denominator = dirX * segmentY - dirY * segmentX;
			if (Math.abs(denominator) >= GRAPH_EPSILON) {
				const t = (x1 * segmentY - y1 * segmentX) / denominator;
				const u = (x1 * dirY - y1 * dirX) / denominator;

				if (t >= 0 && u >= 0 && u <= 1) {
					bestDistance = Math.min(bestDistance, t);
				}
			}
		}

		const radius = Number.isFinite(bestDistance) ? bestDistance : 0;
		outline[i * 2] = dirX * radius;
		outline[i * 2 + 1] = dirY * radius;
	}

	return outline;
}

export function createShapeMorphOutline(style: NodeStyle) {
	if (style.shape === 'circle') {
		return CIRCLE_MORPH_OUTLINE;
	} else {
		return sampleRadialOutline(createShapeVertices(style.shape!, Number(style.shapePoints ?? 0)), SHAPE_MORPH_SAMPLES);
	}
}

export function syncNodeMorphTargets(renderer: GraphRenderer, node: NodeData, role: NodeVisualRole) {
	const visual = renderer.getNodeVisual(node);
	const style = getNodeStyle(node, role);
	const smooth = renderer.config.smoothTransitions;
	const requestGraphDraw = () => renderer.simulator.requestGraphDraw();
	const outline = createShapeMorphOutline(style);

	const hoverDriven = visual.morphRole !== undefined && visual.morphRole !== role;
	visual.morphRole = role;
	const kind = hoverDriven ? 'interaction' : 'topology';

	visual.shapeMorph.sync(getNodeGeometryValues(node, role), outline, smooth, requestGraphDraw, kind);
	visual.strokeMorph.sync(getNodeGeometryValues(node, role, true), outline, smooth, requestGraphDraw, kind);
}

function copyInto(target: Float32Array | undefined, source: Float32Array): Float32Array {
	if (!target || target.length !== source.length) {
		return new Float32Array(source);
	}

	target.set(source);
	return target;
}

function interpolateOutline(target: Float32Array | undefined, source: Float32Array, next: Float32Array, progress: number): Float32Array {
	const out = target && target.length === source.length ? target : new Float32Array(source.length);
	for (let i = 0; i < source.length; i++) {
		out[i] = source[i]! + (next[i]! - source[i]!) * progress;
	}

	return out;
}

function drawMorphOutlinePath(graphics: PIXI.Graphics, outline: Float32Array, size: number) {
	graphics.moveTo(outline[0]! * size, outline[1]! * size);
	for (let i = 2; i < outline.length; i += 2) graphics.lineTo(outline[i]! * size, outline[i + 1]! * size);
	graphics.closePath();
	graphics.rotation = 0;
	return graphics;
}

export class ShapeMorph {
	private _outline: Float32Array | undefined = undefined;
	private _source: Float32Array | undefined = undefined;
	private _target: Float32Array | undefined = undefined;
	private _active = false;
	private _progress = 1;
	private _signature: string | undefined = undefined;
	private _kind: string | undefined = undefined;

	get active() { return this._active; }
	get outline() { return this._outline; }
	get kind() { return this._kind; }

	sync(
		signature: string,
		targetOutline: Float32Array | undefined,
		smooth: boolean,
		requestGraphDraw: () => void,
		kind?: string,
	): void {
		if (this._signature === signature) {
			if (!targetOutline) {
				this.clear();
			}

			return;
		}

		this._signature = signature;
		if (!targetOutline) {
			this.clear();
			return;
		}

		const current = this._outline ?? this._target;
		if (!current) {
			this._source = new Float32Array(targetOutline);
			this._target = new Float32Array(targetOutline);
			this._outline = new Float32Array(targetOutline);
			this._active = false;
			this._progress = 1;
		} else {
			const wasActive = this._active;
			const source = wasActive ? (this._target ?? current) : current;

			this._source = copyInto(this._source, source);
			this._target = copyInto(this._target, targetOutline);
			this._outline = copyInto(this._outline, source);
			this._active = smooth;
			this._progress = smooth ? 0 : 1;
			this._kind = kind;

			if (smooth && !wasActive) {
				requestGraphDraw();
			}
			if (!smooth) {
				this._outline = copyInto(this._outline, targetOutline);
				this._source = copyInto(this._source, targetOutline);
			}
		}
	}

	tick(deltaMS: number, duration: number): boolean {
		if (!this._active || !this._source || !this._target) {
			return false;
		} else {
			this._progress = Math.min(1, this._progress + (duration > 0 ? deltaMS / duration : 1));
			this._outline = interpolateOutline(this._outline, this._source, this._target, this._progress);
			if (this._progress === 1) {
				this._active = false;
			}

			return true;
		}
	}

	draw(graphics: PIXI.Graphics, size: number): boolean {
		if (!this._active || !this._outline) {
			return false;
		} else {
			drawMorphOutlinePath(graphics, this._outline, size);
			return true;
		}
	}

	clear(): void {
		this._outline = undefined;
		this._source = undefined;
		this._target = undefined;
		this._active = false;
		this._progress = 1;
		this._signature = undefined;
		this._kind = undefined;
	}
}
