import type { NodeData } from './types';

import { GRAPH_EPSILON } from './constants';

export type ViewportBounds = { minX: number; minY: number; maxX: number; maxY: number };

export class GraphTransform {
	static identity = new GraphTransform(1, 0, 0);

	constructor(
		public readonly k: number,
		public readonly x: number,
		public readonly y: number,
	) {}

	scale(k: number) {
		return new GraphTransform(this.k * k, this.x, this.y);
	}

	translate(x: number, y: number) {
		return new GraphTransform(this.k, this.x + this.k * x, this.y + this.k * y);
	}

	invert([x, y]: [number, number]): [number, number] {
		return [(x - this.x) / this.k, (y - this.y) / this.k];
	}
}

export function getViewportBounds(transform: GraphTransform, width: number, height: number, padding: number = 0): ViewportBounds {
	const topLeft = transform.invert([-padding, -padding]);
	const bottomRight = transform.invert([width + padding, height + padding]);
	return {
		minX: Math.min(topLeft[0], bottomRight[0]),
		minY: Math.min(topLeft[1], bottomRight[1]),
		maxX: Math.max(topLeft[0], bottomRight[0]),
		maxY: Math.max(topLeft[1], bottomRight[1]),
	};
}

function getCanvasPoint(container: HTMLElement, event: MouseEvent | PointerEvent | WheelEvent | Touch) {
	const rect = container.getBoundingClientRect();
	return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

export function getWorldPoint(
	transform: GraphTransform,
	container: HTMLElement,
	event: MouseEvent | PointerEvent | WheelEvent | Touch,
): [number, number] {
	const point = getCanvasPoint(container, event);
	return transform.invert([point.x, point.y]);
}

export function computeZoomTransform(params: {
	nextScale: number;
	minZoom: number;
	maxZoom: number;
	enablePan: boolean;
	container: HTMLElement;
	scale: number;
	currentTransform: GraphTransform;
	centerTransform: GraphTransform;
	clientX?: number;
	clientY?: number;
}) {
	const clampedScale = Math.min(params.maxZoom, Math.max(params.minZoom, params.nextScale));
	if (Math.abs(clampedScale - params.currentTransform.k) < GRAPH_EPSILON) {
		return params.currentTransform;
	}

	else if (!params.enablePan || params.clientX === undefined || params.clientY === undefined) {
		const cx = params.container.clientWidth / 2;
		const cy = params.container.clientHeight / 2;
		return new GraphTransform(clampedScale, cx * (1 - clampedScale / params.scale), cy * (1 - clampedScale / params.scale));
	}

	else {
		const point = getCanvasPoint(params.container, {
			clientX: params.clientX,
			clientY: params.clientY
		} as PointerEvent);
		const ratio = clampedScale / params.currentTransform.k;
		const fullTransform = new GraphTransform(
			clampedScale,
			point.x - (point.x - params.currentTransform.x) * ratio,
			point.y - (point.y - params.currentTransform.y) * ratio,
		);
		return new GraphTransform(
			clampedScale,
			fullTransform.x - clampedScale * params.centerTransform.x,
			fullTransform.y - clampedScale * params.centerTransform.y,
		);
	}
}

export function createCenterTransform(width: number, height: number, scale: number, currentNode: NodeData | undefined) {
	if (currentNode) {
		return new GraphTransform(1, width / (2 * scale) - currentNode.x!, height / (2 * scale) - currentNode.y!);
	} else {
		return new GraphTransform(1, width / (2 * scale), height / (2 * scale));
	}
}

export function getCurrentLabelOpacity(zoom: number, labelZoomOpacityScale: number) {
	const safeZoom = Math.max(zoom, GRAPH_EPSILON);
	return Math.max(0, Math.min(Math.log2(safeZoom * labelZoomOpacityScale) + 1, 1));
}
