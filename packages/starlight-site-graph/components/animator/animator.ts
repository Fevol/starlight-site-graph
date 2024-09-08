import type { AnimationConfig, AnimationState, ConfigValueType } from './types';

type AnimationToMap<T extends Record<string, AnimationConfig<unknown>>> = {
	[key in keyof T]?: keyof T[key]['properties'];
};

type AnimationsMap<T extends Record<string, AnimationConfig<unknown>>> = {
	[key in keyof T]?: ConfigValueType<T[key]>;
};

type AnimatorOptions = {
	duration?: number;
	onFinished?: () => void;
};

export class Animator<const T extends Record<string, AnimationConfig<unknown>>> {
	private readonly configs: T;
	private animations: Record<keyof T, AnimationState<ConfigValueType<T[keyof T]>>>;
	private onMultipleFinished: { keys: (keyof T)[]; onFinished: (values: ConfigValueType<T[keyof T]>[]) => void }[] =
		[];
	public anyAnimating: boolean = false;

	/**
	 *
	 */
	constructor(configs: T) {
		this.configs = configs;

		this.animations = {} as Record<keyof T, AnimationState<ConfigValueType<T[keyof T]>>>;
		for (const [key, config] of Object.entries(configs)) {
			const initialValue = (config.initialValue ??
				config.properties?.['default'] ??
				config.interpolator.defaultValue()) as ConfigValueType<T[keyof T]>;

			// @ts-expect-error Type is generic and can only be indexed for reading
			this.animations[key] = {
				duration: config.duration,
				progress: 0,
				sourceValue: undefined,
				targetValue: undefined,
				interpolatedValue: initialValue,
			};
		}
	}

	startAnimationTo<K extends keyof T, P extends keyof T[K]['properties']>(
		key: K,
		property: P,
		options: AnimatorOptions = {},
	): void {
		this.startAnimation(key, this.configs[key]!.properties![property as string] as ConfigValueType<T[K]>, options);
	}

	startAnimationsTo(properties: AnimationToMap<T>, options: AnimatorOptions = {}): void {
		for (const [key, property] of Object.entries(properties)) {
			this.startAnimationTo(key, property, options);
		}
	}

	startAnimation<K extends keyof T>(key: K, targetValue: ConfigValueType<T[K]>, options: AnimatorOptions = {}): void {
		const animation = this.animations[key];
		const config = this.configs[key]!;

		if (config === undefined) {
			console.error(key);
			console.trace();
		}

		if (config.interpolator.isEqual(animation.interpolatedValue, targetValue)) {
			this.setValue(key, targetValue);
			return;
		}

		animation.duration = options.duration ?? config.duration;
		animation.sourceValue = config.interpolator.clone(animation.interpolatedValue) as ConfigValueType<T[keyof T]>;
		animation.targetValue = targetValue;
		animation.progress = 0;
		animation.onFinished = options.onFinished;
	}

	startAnimations(animations: AnimationsMap<T>, options: AnimatorOptions = {}): void {
		for (const [key, value] of Object.entries(animations)) {
			this.startAnimation(key, value!, options);
		}
	}

	setValue(key: keyof T, value: ConfigValueType<T[keyof T]>): void {
		this.resetAnimation(key);
		this.animations[key].interpolatedValue = value;
	}

	setValues(values: AnimationsMap<T>): void {
		for (const key in values) {
			this.setValue(key, values[key]!);
		}
	}

	setProperty<K extends keyof T, P extends keyof T[K]['properties']>(
		key: K,
		property: P,
		value: ConfigValueType<T[K]['properties'][P]>,
	): void {
		this.configs[key]!.properties![property as string] = value;
	}

	setAllProperties(key: keyof T, value: ConfigValueType<T[keyof T]>): void {
		const properties = this.configs[key]!.properties;
		for (const property in properties) {
			this.configs[key]!.properties![property as string] = value;
		}
	}

	setProperties<K extends keyof T>(key: K, properties: AnimationToMap<T>): void {
		for (const [property, value] of Object.entries(properties)) {
			this.setProperty(key, property as keyof T[K]['properties'], value!);
		}
	}

	private resetAnimation<K extends keyof T>(key: K): void {
		const animation = this.animations[key]!;

		animation.duration = this.configs[key]!.duration;
		animation.sourceValue = undefined;
		animation.targetValue = undefined;
		animation.progress = 0;
		animation.onFinished = undefined;
	}

	/**
	 * Updates the animations.
	 * @param dt The time since the last update in milliseconds.
	 */
	update(dt: number): void {
		this.anyAnimating = false;
		for (const key in this.configs) {
			const config = this.configs[key]!;
			const animation = this.animations[key]!;

			if (animation.targetValue !== undefined) {
				this.anyAnimating = true;
				animation.progress += dt / animation.duration;
				animation.progress = Math.min(animation.progress, 1);

				const value = config.interpolator.interpolate(
					animation.sourceValue,
					animation.targetValue,
					animation.interpolatedValue,
					config.easing.curve(animation.progress),
				);

				animation.interpolatedValue = value as ConfigValueType<T[keyof T]>;

				if (animation.progress === 1) {
					animation.onFinished?.(value as ConfigValueType<T[keyof T]>);

					this.resetAnimation(key);
				}
			}
		}

		for (const { keys, onFinished } of this.onMultipleFinished) {
			if (!this.isAnimatingMultiple(keys)) {
				onFinished(keys.map(key => this.getValue(key)));
				this.onMultipleFinished = this.onMultipleFinished.filter(x => x.onFinished !== onFinished);
			}
		}
	}

	setOnFinished<K extends keyof T>(key: K, onFinished: (value: ConfigValueType<T[K]>) => void): void {
		this.animations[key].onFinished = onFinished;
	}

	setOnMultipleFinished(keys: (keyof T)[], onFinished: (values: ConfigValueType<T[keyof T]>[]) => void): void {
		this.onMultipleFinished.push({ keys, onFinished });
	}

	isAnimating(key: keyof T): boolean {
		const animation = this.animations[key]!;
		return animation.targetValue !== undefined;
	}

	isAnimatingMultiple(keys: (keyof T)[]): boolean {
		for (const key of keys) {
			if (this.isAnimating(key)) return true;
		}
		return false;
	}

	getValue<K extends keyof T>(key: K): ConfigValueType<T[K]> {
		if (!this.animations[key]) {
			console.error(key);
			console.trace();
		}
		return this.animations[key].interpolatedValue;
	}
}
