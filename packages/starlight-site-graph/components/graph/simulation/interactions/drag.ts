import type { GraphSimulator } from '../simulation';

import { getWorldPoint } from '../../transform';
import { addListener } from './utils';
import { removeNodeHover } from './hover';

import { CLICK_SUPPRESSION_MS, DRAG_RESTART_ALPHA } from '../constants';

function postDragFix(simulator: GraphSimulator) {
	const drag = simulator.activeDrag;
	if (drag) {
		drag.fixAnimationFrame = undefined;
		simulator.worker?.postMessage({
			type: 'fix',
			index: drag.node.index ?? 0,
			x: drag.worldX,
			y: drag.worldY,
		});
	}
}

function scheduleDragFix(simulator: GraphSimulator) {
	const drag = simulator.activeDrag;
	if (drag && drag.fixAnimationFrame === undefined) {
		drag.fixAnimationFrame = requestAnimationFrame(() => postDragFix(simulator));
	}
}

export function enableDrag(simulator: GraphSimulator) {
	addListener(simulator, simulator.container, 'pointerdown', (event: PointerEvent) => {
		if (event.button !== 0 || simulator.activeDrag || simulator.touchPoints.size > 1) {
			return;
		}

		const [x, y] = getWorldPoint(simulator.animation.renderedTransform, simulator.container, event);
		const subject = simulator.findOverlappingNode(x, y);
		if (subject) {
			simulator.camera.userZoomed = true;
			simulator.activeDrag = {
				pointerId: event.pointerId,
				node: subject,
				worldX: subject.x ?? x,
				worldY: subject.y ?? y,
				didDrag: false,
			};
			subject.fx = subject.x ?? x;
			subject.fy = subject.y ?? y;
			scheduleDragFix(simulator);
			simulator.container.setPointerCapture(event.pointerId);
			event.preventDefault();
		}
	});

	addListener(simulator, simulator.container, 'pointermove', (event: PointerEvent) => {
		if (simulator.activeDrag && simulator.activeDrag.pointerId === event.pointerId) {
			const dx = event.movementX / simulator.animation.zoom.value;
			const dy = event.movementY / simulator.animation.zoom.value;
			if (!simulator.activeDrag.didDrag && (Math.abs(dx) > 0 || Math.abs(dy) > 0)) {
				simulator.activeDrag.didDrag = true;
				simulator.suppressClickUntil = Date.now() + CLICK_SUPPRESSION_MS;
				simulator.worker?.postMessage({ type: 'forces', alphaTarget: DRAG_RESTART_ALPHA });
				simulator.worker?.postMessage({ type: 'restart', alpha: DRAG_RESTART_ALPHA });
			}

			simulator.activeDrag.worldX += dx;
			simulator.activeDrag.worldY += dy;
			simulator.activeDrag.node.fx = simulator.activeDrag.worldX;
			simulator.activeDrag.node.fy = simulator.activeDrag.worldY;
			scheduleDragFix(simulator);
		}
	});

	const endDrag = (event: PointerEvent) => {
		if (!simulator.activeDrag || simulator.activeDrag.pointerId !== event.pointerId) {
			return;
		}

		if (simulator.activeDrag.didDrag) {
			simulator.worker?.postMessage({ type: 'forces', alphaTarget: 0 });
		}

		if (simulator.activeDrag.fixAnimationFrame !== undefined) {
			cancelAnimationFrame(simulator.activeDrag.fixAnimationFrame);
			postDragFix(simulator);
		}

		if (simulator.currentlyHovered) {
			removeNodeHover(simulator);
		}

		simulator.activeDrag.node.fx = null;
		simulator.activeDrag.node.fy = null;
		simulator.worker?.postMessage({ type: 'fix', index: simulator.activeDrag.node.index ?? 0, x: null, y: null });
		if (simulator.container.hasPointerCapture(event.pointerId)) {
			simulator.container.releasePointerCapture(event.pointerId);
		}

		simulator.activeDrag = undefined;
	};

	addListener(simulator, simulator.container, 'pointerup', endDrag);
	addListener(simulator, simulator.container, 'pointercancel', endDrag);
}
