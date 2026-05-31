import type { GraphSimulator } from '../simulation';

export function addListener<K extends keyof HTMLElementEventMap>(
	simulator: GraphSimulator,
	target: EventTarget,
	type: K,
	listener: (event: HTMLElementEventMap[K]) => void,
	options?: AddEventListenerOptions,
) {
	target.addEventListener(type, listener as EventListener, options);
	simulator.interactionCleanups.push(() => target.removeEventListener(type, listener as EventListener, options));
}

export function getTouchDistance(touchPoints: Map<number, { clientX: number; clientY: number }>) {
	const [a, b] = [...touchPoints.values()];
	return !a || !b
		? 0
		: Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
}
