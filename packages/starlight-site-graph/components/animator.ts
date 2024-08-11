import * as d3 from "d3";


type AnimationConfig<Key> = {
    key: Key;
    init: any;
    type?: "number" | "string";
    duration?: number;
    easing?: (t: number) => number;
    group?: string;
};

type GroupConfig = {
    id: string;
    duration?: number;
    easing?: (t: number) => number;
    onFinished?: () => void;
}

export class Animator<Key extends string> {
    private configs: Record<Key, AnimationConfig<Key>>;
    private sourceValues: Record<Key, any>;
    private readonly targetValues: Record<Key, any>;
    private readonly intermediateValues: Record<Key, any>;
    private readonly durations: Record<Key, number>;
    private readonly easings: Record<Key, (t: number) => number>;
    private readonly onFinished = {} as Record<Key, (() => void) | undefined>;
    private readonly interpolators = {} as Record<Key, (t: number) => any>;
    private readonly timeElapsed = {} as Record<Key, number>;



    private t: number = 0;
    private anyIsAnimating: boolean = false;

    constructor(configuration: (AnimationConfig<Key> | GroupConfig)[], duration = 0.5, easing = d3.easeExp) {
        const { animations, groups } = configuration.reduce((acc, config) => {
            if ("id" in config) {
                acc.groups[config.id] = config;
            } else {
                acc.animations[config.key] = config;
            }
            return acc;
        }, { animations: [] as Record<Key, AnimationConfig<Key>>, groups: {} as Record<string, GroupConfig> });
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
        }

        this.targetValues = {...this.sourceValues};
        this.intermediateValues = {...this.sourceValues};
        this.setInterpolators();
    }

    public setTarget(key: Key, value: any): void {
        this.t = 0;
        this.anyIsAnimating = true;
        this.timeElapsed[key] = 0;
        this.targetValues[key] = value;
        this.setInterpolators({ key: value } as Record<Key, any>);
    }

    public setInterpolators(values: Partial<Record<Key, any>> = this.sourceValues) {
        for (const key in values) {
            if (typeof this.sourceValues[key] === "string") {
                this.interpolators[key] = d3.interpolateRgb(this.sourceValues[key], this.targetValues[key]);
            } else {
                this.interpolators[key] = d3.interpolateNumber(this.sourceValues[key], this.targetValues[key]);
            }
        }
    }

    public setTargets(values: Partial<Record<Key, any>>): void {
        this.t = 0;
        this.anyIsAnimating = true;
        this.sourceValues = {...this.intermediateValues};
        for (const key in values) {
            this.targetValues[key] = values[key];
            this.timeElapsed[key] = 0;
            this.onFinished[key] = undefined;
        }
        this.setInterpolators(values);
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

