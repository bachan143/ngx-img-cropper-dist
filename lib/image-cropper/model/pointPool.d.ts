import { Point } from './point';
export declare class PointPool {
    private borrowed;
    private firstAvailable;
    constructor(initialSize?: number);
    get instance(): PointPool;
    borrow(x: number, y: number): Point;
    returnPoint(p: Point): void;
}
//# sourceMappingURL=pointPool.d.ts.map