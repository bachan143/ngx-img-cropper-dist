export interface IPoint {
    x: number;
    y: number;
    next: Point;
    prev: Point;
}
export declare class Point implements IPoint {
    x: number;
    y: number;
    private myNext;
    private myPrev;
    constructor(x?: number, y?: number);
    get next(): Point;
    set next(p: Point);
    get prev(): Point;
    set prev(p: Point);
}
//# sourceMappingURL=point.d.ts.map