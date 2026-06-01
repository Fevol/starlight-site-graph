import type { GraphSimulator } from '../simulation';

import { addListener, getTouchDistance } from './utils';

import { CLICK_SUPPRESSION_MS } from '../constants';

export function enableZoom(simulator: GraphSimulator) {
	addListener(
		simulator,
		simulator.container,
		'wheel',
		(event: WheelEvent) => {
			if (simulator.config.enableZoom) {
				event.preventDefault();
				simulator.camera.applyZoomScale(
					simulator.camera.zoomTransform.k * Math.exp(-event.deltaY * simulator.config.zoomStep),
					event.clientX,
					event.clientY,
				);
			}
		},
		{ passive: false },
	);

	addListener(simulator, simulator.container, 'pointerdown', (event: PointerEvent) => {
		if (event.pointerType === 'touch') {
			simulator.touchPoints.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });
			if (simulator.touchPoints.size === 2 && simulator.config.enableZoom) {
				simulator.activePinch = {
					distance: getTouchDistance(simulator.touchPoints),
					transform: simulator.camera.zoomTransform,
				};
			}
		}

		else if (simulator.config.enablePan && event.button === 0 && !simulator.activeDrag) {
			simulator.camera.userZoomed = true;
			simulator.activePan = {
				pointerId: event.pointerId,
				startClientX: event.clientX,
				startClientY: event.clientY,
				startTransform: simulator.camera.zoomTransform,
				didPan: false,
			};
			document.body.style.cursor = 'grab';
			simulator.container.setPointerCapture(event.pointerId);
		}
	});

	addListener(simulator, simulator.container, 'pointermove', (event: PointerEvent) => {
		if (event.pointerType === 'touch') {
			if (simulator.touchPoints.has(event.pointerId)) {
				simulator.touchPoints.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });
			}
			if (simulator.activePinch && simulator.touchPoints.size === 2) {
				const distance = getTouchDistance(simulator.touchPoints);
				if (distance > 0) {
					const [a, b] = [...simulator.touchPoints.values()];
					simulator.camera.applyZoomScale(
						simulator.activePinch.transform.k * (distance / simulator.activePinch.distance),
						(a!.clientX + b!.clientX) / 2,
						(a!.clientY + b!.clientY) / 2,
					);
				}
			}
		}

		else if (simulator.activePan && simulator.activePan.pointerId === event.pointerId) {
			const dx = event.clientX - simulator.activePan.startClientX;
			const dy = event.clientY - simulator.activePan.startClientY;
			if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
				simulator.activePan.didPan = true;
				simulator.suppressClickUntil = Date.now() + CLICK_SUPPRESSION_MS;
			}
			simulator.camera.pan(simulator.activePan.startTransform, dx, dy);
		}
	});

	const endPan = (event: PointerEvent) => {
		if (event.pointerType === 'touch') {
			simulator.touchPoints.delete(event.pointerId);
			if (simulator.touchPoints.size < 2) {
				simulator.activePinch = undefined;
			}
		}

		else if (simulator.activePan && simulator.activePan.pointerId === event.pointerId) {
			if (simulator.container.hasPointerCapture(event.pointerId)) {
				simulator.container.releasePointerCapture(event.pointerId);
			}
			simulator.activePan = undefined;
			document.body.style.cursor = 'default';
		}
	};

	addListener(simulator, simulator.container, 'pointerup', endPan);
	addListener(simulator, simulator.container, 'pointercancel', endPan);
	simulator.camera.refreshZoomConstraints(true);
}
