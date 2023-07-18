import { Point } from './point';
export declare class Bounds {
    left: number;
    right: number;
    top: number;
    bottom: number;
    constructor(x?: number, y?: number, width?: number, height?: number);
    get width(): number;
    get height(): number;
    getCentre(): Point;
}
//# sourceMappingURL=bounds.d.ts.map