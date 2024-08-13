import type {AnimationConfig, AnimationState, ConfigValueType} from "./types";

export class Animator<const T extends Record<string, AnimationConfig<unknown>>> {
    private readonly configs: T;
    private animations: Record<keyof T, AnimationState<ConfigValueType<T[keyof T]>>>;

    /**
     *
     */
    constructor(configs: T) {
        this.configs = configs;

        this.animations = {} as Record<keyof T, AnimationState<ConfigValueType<T[keyof T]>>>;
        for (const [key, config] of Object.entries(configs)) {
            const initialValue = (config.initialValue ?? config.properties?.["default"] ?? config.interpolator.defaultValue()) as ConfigValueType<T[keyof T]>;
            this.animations[key] = {
                progress: 0,
                sourceValue: initialValue,
                interpolatedValue: initialValue,
                targetValue: initialValue
            };
        }
    }

    startAnimationTo<K extends keyof T, P extends keyof T[K]['properties']>(key: K, property: P, onFinished?: (value: ConfigValueType<T[K]>) => void): void {
        this.startAnimation(key, this.configs[key]!.properties![property as string] as ConfigValueType<T[K]>, onFinished);
    }

    startAnimationsTo<K extends keyof T, P extends keyof T[K]['properties']>(properties: Record<K, P>): void {
        for (const [key, property] of Object.entries(properties) as [K, P][]) {
            this.startAnimationTo(key, property);
        }
    }

    startAnimation<K extends keyof T>(key: K, targetValue: ConfigValueType<T[K]>, onFinished?: (value: ConfigValueType<T[K]>) => void): void {
        const animation = this.animations[key];
        const config = this.configs[key]!;

        if (config === undefined) {
            console.error(key)
            console.trace()
        }

        animation.sourceValue = config.interpolator.clone(animation.interpolatedValue) as ConfigValueType<T[keyof T]>;
        animation.targetValue = targetValue;
        animation.progress = 0;
        animation.onFinished = onFinished;
    }

    startAnimations(animations: Record<keyof T, ConfigValueType<T[keyof T]>>): void {
        for (const key in animations) {
            this.startAnimation(key, animations[key]!);
        }
    }

    private resetAnimation<K extends keyof T>(key: K): void {
        const animation = this.animations[key]!;

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
        for (const key in this.configs) {
            const config = this.configs[key]!;
            const animation = this.animations[key]!;

            if (animation.targetValue !== undefined) {
                animation.progress += dt / config.duration;
                animation.progress = Math.min(animation.progress, 1);

                const value = config.interpolator.interpolate(
                    animation.sourceValue,
                    animation.targetValue,
                    animation.interpolatedValue,
                    config.easing.curve(animation.progress)
                );

                animation.interpolatedValue = value as ConfigValueType<T[keyof T]>;

                if (animation.progress === 1) {
                    animation.onFinished?.(value as ConfigValueType<T[keyof T]>);

                    this.resetAnimation(key);
                }
            }
        }
    }

    setOnFinished<K extends keyof T>(key: K, onFinished: (value: ConfigValueType<T[K]>) => void): void {
        this.animations[key].onFinished = onFinished;
    }

    isAnimating(key: keyof T): boolean {
        const animation = this.animations[key]!;
        return animation.targetValue !== undefined;
    }

    getValue<K extends keyof T>(key: K): ConfigValueType<T[K]> {
        if (!this.animations[key]) {
            console.error(key)
            console.trace()
        }
        return this.animations[key].interpolatedValue;
    }
}
