import * as d3 from "d3";


type Animatable<T> = (from: T, to: T) => (t: number) => T;
type AnimatorCurve = (t: number) => number;
type AnimationConfig<Key, Value> = {
    key: Key;
    init: Value;
    interpolator: Animatable<Value>;
    duration?: number;
    easing?: AnimatorCurve;
    group?: string;
};

type GroupConfig = {
    id: string;
    duration?: number;
    easing?: (t: number) => number;
    onFinished?: () => void;
}

export class Animator<Key extends string, Value> {
    private configs: Record<Key, AnimationConfig<Key, Value>>;
    private sourceValues: Record<Key, Value>;
    private readonly targetValues: Record<Key, Value>;
    private readonly intermediateValues: Record<Key, Value>;
    private readonly durations: Record<Key, number>;
    private readonly easings: Record<Key, AnimatorCurve>;
    private readonly onFinished = {} as Record<Key, (() => void) | undefined>;
    private readonly interpolators = {} as Record<Key, Animatable<Value>>;
    private readonly timeElapsed = {} as Record<Key, number>;

    private anyIsAnimating: boolean = false;

    constructor(configuration: (AnimationConfig<Key, Value> | GroupConfig)[], duration = 0.5, easing = d3.easeExp) {
        const { animations, groups } = configuration.reduce((acc, config) => {
            if ("id" in config) {
                acc.groups[config.id] = config;
            } else {
                acc.animations[config.key] = config;
            }
            return acc;
        }, { animations: [] as Record<Key, AnimationConfig<Key, Value>>, groups: {} as Record<string, GroupConfig> });
        this.configs = animations;


        this.sourceValues = [] as Record<Key, any>;
        this.durations = [] as Record<Key, number>;
        this.easings = [] as Record<Key, (t: number) => number>;

        for (const key in animations) {
            this.sourceValues[key] = animations[key].init;
            const group = groups[animations[key].group!];
            this.durations[key] = animations[key].duration ?? group?.duration ?? duration;
            this.easings[key] = animations[key].easing ?? group?.easing ?? easing;
            this.timeElapsed[key] = 0;
            this.interpolators[key] = animations[key].interpolator(this.sourceValues[key], this.sourceValues[key]);
        }

        this.targetValues = {...this.sourceValues};
        this.intermediateValues = {...this.sourceValues};
    }

    public setTarget(key: Key, value: any): void {
        this.t = 0;
        this.anyIsAnimating = true;
        this.timeElapsed[key] = 0;
        this.targetValues[key] = value;
        this.interpolators[key] = this.configs[key].interpolator(this.sourceValues[key], this.targetValues[key]);
    }

    public setTargets(values: Partial<Record<Key, any>>): void {
        this.t = 0;
        this.anyIsAnimating = true;
        this.sourceValues = {...this.intermediateValues};
        for (const key in values) {
            this.targetValues[key] = values[key];
            this.timeElapsed[key] = 0;
            this.onFinished[key] = undefined;
            this.interpolators[key] = this.configs[key].interpolator(this.sourceValues[key], this.targetValues[key]);
        }
    }

    public setOnFinished(key: Key, onFinished: () => void): void {
        this.onFinished[key] = onFinished;
    }

    public update(delta: number): void {
        if (!this.anyIsAnimating) return;

        const deltaT = delta / 1000;
        let stillAnimating = false;
        for (const key in this.sourceValues) {
            if (this.timeElapsed[key] === 1) continue;

            this.timeElapsed[key] = Math.min(1, this.timeElapsed[key] + (deltaT / this.durations[key]));
            this.intermediateValues[key] = this.interpolators[key](this.easings[key](this.timeElapsed[key]));
            if (this.timeElapsed[key] >= 1) {
                if (this.onFinished[key]) {
                    this.onFinished[key]();
                    this.onFinished[key] = undefined;
                }
            } else {
                stillAnimating = true;
            }
        }

        this.anyIsAnimating = stillAnimating;
    }

    public get(key: Key): typeof this.intermediateValues[Key] {
        return this.intermediateValues[key];
    }

    public isAnimating(key: Key): boolean {
        return this.timeElapsed[key] !== 1;
    }

    public hasFinishedAnimating(): boolean {
        return this.anyIsAnimating;
    }
}

