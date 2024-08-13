import type {AnimationCurve} from "./types";

export class EaseInQuad implements AnimationCurve {
    curve(x: number): number {
        return x * x;
    }
}

export class EaseOutQuad implements AnimationCurve {
    curve(x: number): number {
        return x * (2 - x);
    }
}

export class EaseInOutQuad implements AnimationCurve {
    curve(x: number): number {
        return x < 0.5 ? 2 * x * x : -1 + (4 - 2 * x) * x;
    }
}

export class EaseLinear implements AnimationCurve {
    curve(x: number): number {
        return x;
    }
}
