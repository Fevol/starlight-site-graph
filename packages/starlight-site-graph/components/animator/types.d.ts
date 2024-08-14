export interface Interpolator<T> {
	/**
	 * Interpolates between two values. The first value is considered to be at progress 0, and the second value at progress 1.
	 *
	 * @param a The first value.
	 * @param b The second value.
	 * @param current The current value, this is modified if possible.
	 * @param t The progress of the interpolation, between 0 and 1.
	 *
	 * @returns The interpolated value.
	 */
	interpolate(a: T, b: T, current: T, t: number): T;

	defaultValue(): T;

	/**
	 * Clones the given value.
	 * Must be a deep clone.
	 *
	 * @param x The value to clone.
	 */
	clone(x: T): T;
}

export interface AnimationCurve {
	/**
	 * @param t The absolute progress of the animation, between 0 and 1.
	 *
	 * @returns The value of the curve at the given progress. This value should be between 0 and 1.
	 */
	curve(t: number): number;
}

/**
 * The initial value might be modified.
 */
export interface AnimationConfig<T> {
	interpolator: Interpolator<T>;
	easing: AnimationCurve;
	duration: number;
	initialValue?: T;
	properties?: Record<string, T>;
}

/**
 * Contains the current state of an animation.
 *
 * @remarks Technically this should be modeled with a union type, but then we have type errors when modifying this object.
 */
export interface AnimationState<T> {
	sourceValue?: T | undefined;
	interpolatedValue: T;
	targetValue?: T | undefined;
	progress: number;
	onFinished?: ((value: T) => void) | undefined;
}

export type ConfigValueType<T> = T extends AnimationConfig<infer U> ? U : never;
