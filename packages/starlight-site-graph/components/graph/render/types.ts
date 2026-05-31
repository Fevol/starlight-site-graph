import * as PIXI from 'pixi.js';
import type { GraphConfig } from '../config/types';
import type { NodeVisualRole } from '../types';
import type { ShapeMorph } from './node/morph';
import type { Track } from './track';

export type NodeVisualState = {
	rendered: boolean;
	visible: boolean;
	role: NodeVisualRole;

	hovered: boolean;
	adjacent: boolean;

	geometryDirty: boolean;
	styleDirty: boolean;

	styleValues?: string | undefined;

	alpha: Track<number>;
	shapeTint: Track<number>;
	strokeTint: Track<number>;
	animating: boolean;
	labelOffset: Track<number>;
	labelScale: Track<number>;
	labelAlpha: Track<number>;

	renderedShapeRotation: Track<number>;
	renderedComputedSize: Track<number>;
	renderedFullRadius: Track<number>;
	renderedCornerRadius: Track<number>;
	renderedStrokeCornerRadius: Track<number>;

	shapeMorph: ShapeMorph;
	strokeMorph: ShapeMorph;

	morphRole?: NodeVisualRole | undefined;
};

export type LinkVisualState = {
	visible: boolean;
	hovered: boolean;
	lineAlpha: number;
	overlayAlpha: number;
};

export type NodeLinkBoundaryGeometry = {
	radius: number;
	pathRadius: number;
	cornerRadius: number;
	rotation: number;
	outline?: Float32Array;
};

export type NodeDisplay = {
	node?: PIXI.Graphics | undefined;
	stroke?: PIXI.Graphics | undefined;
	label?: PIXI.Text | undefined;
	visual?: NodeVisualState | undefined;
};

export type LinkDisplay = {
	line?: PIXI.Sprite | undefined;
	hoverLine?: PIXI.Sprite | undefined;
	arrow?: PIXI.Graphics | undefined;
	hoverArrow?: PIXI.Graphics | undefined;
	visual?: LinkVisualState | undefined;
};

export type TransitionKind = 'zoom' | 'pan' | 'interaction' | 'visibility' | 'topology' | 'lifecycle' | 'palette';
export type PanTransitionKind = 'pan' | 'zoom';
export type EasingId = GraphConfig['zoomEase'];
export type NumberTrack = Track<number>;
export type ColorTrack = Track<string>;
