/**
 * Represents the series of hooks and user-provided transformations
 * on the default data / configuration of the Ticker
 */
export default class Pipeline {
    private _onLayout: (data: {
        position: vec2;
        limits: Rect;
    }) => Partial<{ size: Rect; position: vec2 }> | void;
    private _onMove: (data: {
        direction: number;
        dt: DOMHighResTimeStamp;
        t: DOMHighResTimeStamp;
    }) => Partial<{
        direction: number;
    }> | void;

    constructor() {
        this._onLayout = () => {};
        this._onMove = () => {};
    }

    get onLayout() {
        return this._onLayout;
    }

    get onMove() {
        return this._onMove;
    }

    set onLayout(callback: Pipeline["_onLayout"]) {
        this._onLayout = callback;
    }

    set onMove(callback: Pipeline["_onMove"]) {
        this._onMove = callback;
    }
}
