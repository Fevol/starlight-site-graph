
interface Interpolator<T> {
    /**
     * Interpolates between two values. The first value is considered to be at progress 0, and the second value at progress 1.
     * 
     * @param a The first value.
     * @param b The second value.
     * @param current The current value, this is modified if possible.
     * @param x The progress of the interpolation, between 0 and 1.
     * 
     * @returns The interpolated value.
     */
    interpolate(a: T, b: T, current: T, x: number): T;

    defaultValue(): T;

    /**
     * Clones the given value.
     * Must be a deep clone.
     */
    clone(x: T): T;
}

interface AnimationCurve2 {
    /**
     * @param x The absolute progress of the animation, between 0 and 1.
     * 
     * @returns The value of the curve at the given progress. This value should be between 0 and 1.
     */
    curve(x: number): number;
}

/**
 * The initial value might be modified.
 */
interface AnimationConfig2<T> {
    interpolator: Interpolator<T>;
    easing: AnimationCurve2;
    duration: number;
    initialValue?: T;
}

/**
 * Note: technically this should be modeled with a union type, but then we have type errors when modifying this object.
 */
interface AnimationState2<T> {
    sourceValue?: (T | undefined);
    targetValue?: (T | undefined);
    progress: number;
    onFinished?: ((value: T) => void) | undefined;
}

type ConfigValueType<T> = T extends AnimationConfig2<infer U> ? U : never;

class Animator2<const T extends Record<string, AnimationConfig2<unknown>>> {
    private values: Record<keyof T, ConfigValueType<T[keyof T]>>;
    private readonly configs: T;
    private animations: Record<keyof T, AnimationState2<ConfigValueType<T[keyof T]>>>;

    /**
     * 
     */
    constructor(configs: T) {
        this.configs = configs;

        this.values = {} as Record<keyof T, ConfigValueType<T[keyof T]>>;
        for (const key in configs) {
            const config = configs[key]!;
            this.values[key] = (config.initialValue ?? config.interpolator.defaultValue()) as ConfigValueType<T[keyof T]>;
        }

        this.animations = {} as Record<keyof T, AnimationState2<ConfigValueType<T[keyof T]>>>;
        for (const key in configs) {
            this.animations[key] = {
                progress: 0
            };
        }
    }

    startAnimation<K extends keyof T>(key: K, targetValue: ConfigValueType<T[K]>, onFinished?: (value: ConfigValueType<T[K]>) => void): void {
        const animation = this.animations[key];
        const config = this.configs[key]!;

        animation.sourceValue = config.interpolator.clone(this.values[key]) as ConfigValueType<T[keyof T]>;
        animation.targetValue = targetValue;
        animation.progress = 0;
        animation.onFinished = onFinished;
    }

    private resetAnimation<K extends keyof T>(key: K): void {
        const animation = this.animations[key]!;

        animation.sourceValue = undefined;
        animation.targetValue = undefined;
        animation.progress = 0;
        animation.onFinished = undefined;
    }

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
                    this.values[key], 
                    config.easing.curve(animation.progress)
                );

                this.values[key] = value as ConfigValueType<T[keyof T]>;

                if (animation.progress === 1) {
                    animation.onFinished?.(value as ConfigValueType<T[keyof T]>);

                    this.resetAnimation(key);
                }
            }
        }
    }

    isAnimating(key: keyof T): boolean {
        const animation = this.animations[key]!;
        return animation.targetValue !== undefined;
    }

    getValue<K extends keyof T>(key: K): ConfigValueType<T[K]> {
        return this.values[key];
    }
}

// #region Easing

class EaseInQuad implements AnimationCurve2 {
    curve(x: number): number {
        return x * x;
    }
}

class EaseOutQuad implements AnimationCurve2 {
    curve(x: number): number {
        return x * (2 - x);
    }
}

class EaseInOutQuad implements AnimationCurve2 {
    curve(x: number): number {
        return x < 0.5 ? 2 * x * x : -1 + (4 - 2 * x) * x;
    }
}

class EaseLinear implements AnimationCurve2 {
    curve(x: number): number {
        return x;
    }
}

// #endregion

// #region Interpolators

class NumberInterpolator implements Interpolator<number> {
    interpolate(a: number, b: number, _: number, x: number): number {
        return a + (b - a) * x;
    }

    defaultValue(): number {
        return 0;
    }

    clone(x: number): number {
        return x;
    }
}

class Color {
    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class ColorInterpolator implements Interpolator<Color> {
    interpolate(a: Color, b: Color, current: Color, x: number): Color {
        current.r = a.r + (b.r - a.r) * x;
        current.g = a.g + (b.g - a.g) * x;
        current.b = a.b + (b.b - a.b) * x;
        return current;
    }

    defaultValue(): Color {
        return new Color(0, 0, 0);
    }

    clone(x: Color): Color {
        return new Color(x.r, x.g, x.b);
    }
}

// #endregion

const config = {
    test: {
        duration: 250,
        easing: new EaseLinear(),
        interpolator: new NumberInterpolator(),
        initialValue: 0,
    },
    testColor: {
        duration: 1000,
        easing: new EaseInOutQuad(),
        interpolator: new ColorInterpolator(),
    }
} as const satisfies Record<string, AnimationConfig2<unknown>>;

function test() {
    const animator = new Animator2(config);

    // Start animation on key "test" with target value 1, also log the value at the end of the animation.
    animator.startAnimation("test", 1, (value) => {
        console.log(value);
    });

    animator.getValue("test");

    animator.startAnimation('testColor', new Color(255, 0, 0));

    animator.getValue('testColor');
}