import { GRAPH_EPSILON } from '../constants';


export type Track<T> = {
	value: T;
	source: T;
	target: T;
	progress: number;
	active: boolean;
	kind?: string | undefined;
};

export function createTrack<T>(value: T): Track<T> {
	return { value, source: value, target: value, progress: 1, active: false };
}

export const numberChanged = (current: number, next: number) => Math.abs(current - next) > GRAPH_EPSILON;

export function retargetTrack<T>(
	track: Track<T>,
	target: T,
	duration: number,
	changed: (current: T, next: T) => boolean = (current, next) => !Object.is(current, next),
	kind?: string,
) {
	if (duration <= 0) {
		track.value = target;
		track.source = target;
		track.target = target;
		track.progress = 1;
		track.active = false;
		track.kind = kind;
		return;
	}
	if (changed(track.target, target)) {
		track.source = track.value;
		track.target = target;
		track.progress = 0;
		track.active = true;
		track.kind = kind;
	}
}

export function tickTrack<T>(
	track: Track<T>,
	deltaMS: number,
	duration: number,
	interpolate: (source: T, target: T, progress: number) => T,
): boolean {
	if (!track.active) {
		return false;
	}
	if (duration <= 0) {
		track.value = track.target;
		track.progress = 1;
		track.active = false;
		return false;
	}

	track.progress = Math.min(1, track.progress + deltaMS / duration);
	track.value = interpolate(track.source, track.target, track.progress);
	if (track.progress === 1) {
		track.value = track.target;
		track.active = false;
	}

	return track.active;
}
