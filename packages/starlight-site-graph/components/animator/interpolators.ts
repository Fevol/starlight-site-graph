import * as d3 from 'd3';
import type { Interpolator } from './types';

export class NumberInterpolator implements Interpolator<number> {
	interpolate(a: number, b: number, _: number, x: number): number {
		return a + (b - a) * x;
	}

	defaultValue(): number {
		return 0;
	}

	clone(x: number): number {
		return x;
	}

	isEqual(a: number, b: number): boolean {
		return Math.abs(a - b) < 1e-6;
	}
}

export class ColorInterpolator implements Interpolator<string> {
	interpolate(a: string, b: string, _: string, x: number): string {
		return d3.interpolateRgb(a, b)(x);
	}

	defaultValue(): string {
		return '#ffffff';
	}

	clone(x: string): string {
		return x;
	}

	isEqual(a: string, b: string): boolean {
		return a === b;
	}
}
