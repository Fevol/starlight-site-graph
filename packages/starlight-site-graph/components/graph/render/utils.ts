import * as PIXI from 'pixi.js';

export function hexToRGBNumber(hex: string): number {
	return parseInt(hex.replace('#', ''), 16) || 0;
}

export function lerpRGBNumber(a: number, b: number, t: number): number {
	const r = Math.round(((a >>> 16) & 0xff) + (((b >>> 16) & 0xff) - ((a >>> 16) & 0xff)) * t);
	const g = Math.round(((a >>> 8) & 0xff) + (((b >>> 8) & 0xff) - ((a >>> 8) & 0xff)) * t);
	const bl = Math.round((a & 0xff) + ((b & 0xff) - (a & 0xff)) * t);
	return (r << 16) | (g << 8) | bl;
}

export function destroyDisplayObject(stage: PIXI.Container, object?: PIXI.ContainerChild) {
	if (!object) {
		return;
	}
	stage.removeChild(object);
	object.destroy();
}

export function hideDisplayObjects(...objects: Array<{ visible: boolean } | undefined>) {
	for (const object of objects) {
		if (object) {
			object.visible = false;
		}
	}
}
