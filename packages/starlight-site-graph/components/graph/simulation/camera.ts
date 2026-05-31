import type { GraphSimulator } from './simulation';
import type { CenterMode, CenterTransformOptions } from './types';
import type { PanTransitionKind } from '../render/types';

import { createCenterTransform, computeZoomTransform, getCurrentLabelOpacity, GraphTransform } from '../transform';

import {
	CAMERA_FOLLOW_MIN_SCREEN_DELTA,
	CAMERA_FOLLOW_SMOOTHING_MS,
	FRAME_DURATION_MS,
} from './constants';
import { GRAPH_EPSILON } from '../constants';


export class GraphCamera {
	transform: GraphTransform = GraphTransform.identity;
	zoomTransform: GraphTransform = GraphTransform.identity;
	centerTransform: GraphTransform = GraphTransform.identity;

	animateZoomOverride = false;
	userZoomed = false;
	pendingCenterAnimation = false;
	centerMode: CenterMode = 'trail';

	scale = 1;

	viewportWidth = 0;
	viewportHeight = 0;
	cameraRenderRequested = false;

	constructor(private simulator: GraphSimulator) {}

	requestCameraRender() {
		this.cameraRenderRequested = true;
		this.simulator.renderer?.ensureTickerActive();
	}

	consumeCameraRenderRequest() {
		const requested = this.cameraRenderRequested;
		this.cameraRenderRequested = false;
		return requested;
	}

	syncCanvasZoom() {
		if (this.simulator.renderer?.canvas !== undefined) {
			this.simulator.renderer.resetZoom(this.zoomTransform);
		}
	}

	syncViewportSize(width: number, height: number) {
		this.viewportWidth = width;
		this.viewportHeight = height;
	}

	initializeView(scale: number) {
		this.scale = scale;
		this.zoomTransform = GraphTransform.identity.scale(scale);
		this.syncCanvasZoom();
	}

	clear() {
		this.zoomTransform = GraphTransform.identity;
		this.centerTransform = GraphTransform.identity;
		this.transform = GraphTransform.identity;
		this.pendingCenterAnimation = false;
	}

	getCurrentLabelOpacity(k = this.transform.k): number {
		return getCurrentLabelOpacity(k, this.simulator.context.config.labelZoomOpacityScale);
	}

	refreshZoomConstraints(immediate = false) {
		const { minZoom, maxZoom } = this.simulator.context.config;
		const clampedScale = Math.min(maxZoom, Math.max(minZoom, this.zoomTransform.k));

		if (clampedScale !== this.zoomTransform.k) {
			this.zoomTransform = new GraphTransform(clampedScale, this.zoomTransform.x, this.zoomTransform.y);
			this.syncCanvasZoom();
			this.updateTransform(immediate);
		}
	}

	resetZoom(immediate = false) {
		const { minZoom, maxZoom } = this.simulator.context.config;
		this.userZoomed = false;
		this.zoomTransform = GraphTransform.identity.scale(Math.min(maxZoom, Math.max(minZoom, this.scale)));
		this.syncCanvasZoom();
		this.updateCenterTransform();
		this.updateTransform(immediate);
	}

	updateZoom(scale?: number, x?: number, y?: number, immediate = false, panKind: PanTransitionKind = 'pan') {
		const { animationState, config } = this.simulator.context;

		const previousZoomTarget = animationState.zoom.target;
		const previousTransformXTarget = animationState.transformX.target;
		const previousTransformYTarget = animationState.transformY.target;
		const previousLabelOpacityTarget = animationState.labelOpacity.target;

		animationState.setViewport(
			{ zoom: scale ?? this.transform.k, x: x ?? this.transform.x, y: y ?? this.transform.y },
			config,
			immediate,
			panKind,
		);
		animationState.setLabelOpacityBase(this.getCurrentLabelOpacity(this.transform.k), config, immediate);

		const zoomChanged = Math.abs(animationState.zoom.target - previousZoomTarget) > GRAPH_EPSILON;
		const transformXChanged = Math.abs(animationState.transformX.target - previousTransformXTarget) > GRAPH_EPSILON;
		const transformYChanged = Math.abs(animationState.transformY.target - previousTransformYTarget) > GRAPH_EPSILON;
		const labelOpacityChanged = Math.abs(animationState.labelOpacity.target - previousLabelOpacityTarget) > GRAPH_EPSILON;
		const cameraChanged = zoomChanged || transformXChanged || transformYChanged;

		this.animateZoomOverride = immediate || (cameraChanged && !animationState.cameraAnimating);

		if (cameraChanged || labelOpacityChanged) {
			this.simulator.requestGraphDraw();
		} else {
			this.requestCameraRender();
		}
	}

	updateTransform(immediate = false, panKind: PanTransitionKind = 'pan') {
		this.transform = this.zoomTransform
			.translate(this.centerTransform.x, this.centerTransform.y)
			.scale(this.centerTransform.k);
		this.updateZoom(this.transform.k, this.transform.x, this.transform.y, immediate, panKind);
	}

	updateCenterTransform(options: CenterTransformOptions = {}): boolean {
		const { minZoom, maxZoom } = this.simulator.context.config;
		const effectiveScale = Math.min(maxZoom, Math.max(minZoom, this.scale));
		const nextCenterTransform = createCenterTransform(
			this.viewportWidth,
			this.viewportHeight,
			effectiveScale,
			this.simulator.currentNode,
		);

		if (this.centerTransform.x !== nextCenterTransform.x || this.centerTransform.y !== nextCenterTransform.y) {
			if (options.smooth) {
				const dx = nextCenterTransform.x - this.centerTransform.x;
				const dy = nextCenterTransform.y - this.centerTransform.y;
				const screenDelta = Math.hypot(dx, dy) * this.zoomTransform.k;
				if (screenDelta < (options.minScreenDelta ?? CAMERA_FOLLOW_MIN_SCREEN_DELTA)) {
					return false;
				}

				const deltaMS = options.deltaMS ?? FRAME_DURATION_MS;
				const smoothing = 1 - Math.exp(-deltaMS / CAMERA_FOLLOW_SMOOTHING_MS);
				this.centerTransform = new GraphTransform(
					1,
					this.centerTransform.x + dx * smoothing,
					this.centerTransform.y + dy * smoothing,
				);
			} else {
				this.centerTransform = nextCenterTransform;
			}
			return true;
		}

		return false;
	}

	syncToCenter(): void {
		if (this.userZoomed) {
			return;
		}

		const { cameraAnimating } = this.simulator.context.animationState;

		if (this.pendingCenterAnimation) {
			if (!cameraAnimating) {
				this.pendingCenterAnimation = false;
				if (this.updateCenterTransform()) {
					this.updateTransform(false);
				}
			}

			return;
		}

		else if (this.centerMode === 'trail' || cameraAnimating) {
			return;
		}

		else if (this.updateCenterTransform()) {
			this.updateTransform(true);
		}
	}

	syncToCenterOnTick(): void {
		if (this.userZoomed || this.centerMode !== 'trail' || this.pendingCenterAnimation) {
			return;
		}

		if (this.simulator.context.animationState.cameraAnimating) {
			return;
		}
		if (this.updateCenterTransform({ smooth: true, deltaMS: FRAME_DURATION_MS })) {
			this.updateTransform(true);
		}
	}

	pan(baseTransform: GraphTransform, dx: number, dy: number) {
		this.userZoomed = true;
		this.zoomTransform = new GraphTransform(baseTransform.k, baseTransform.x + dx, baseTransform.y + dy);
		this.syncCanvasZoom();
		this.updateTransform();
	}

	applyZoomScale(nextScale: number, clientX?: number, clientY?: number, immediate = false) {
		const { config } = this.simulator.context;
		const currentTransform = this.simulator.context.animationState.renderedTransform;
		const clampedScale = Math.min(config.maxZoom, Math.max(config.minZoom, nextScale));
		if (Math.abs(clampedScale - currentTransform.k) < GRAPH_EPSILON) {
			return;
		}

		this.userZoomed = true;
		const nextTransform = computeZoomTransform({
			nextScale: clampedScale,
			minZoom: config.minZoom,
			maxZoom: config.maxZoom,
			enablePan: config.enablePan,
			container: this.simulator.container,
			scale: this.scale,
			currentTransform,
			centerTransform: this.centerTransform,
			...(clientX !== undefined ? { clientX } : {}),
			...(clientY !== undefined ? { clientY } : {}),
		});

		if (nextTransform !== currentTransform) {
			this.zoomTransform = nextTransform;
			this.syncCanvasZoom();
			this.updateTransform(immediate, 'zoom');
		}
	}
}
