/**
 * Represents the series of hooks and user-provided transformations
 * on the default data / configuration of the Ticker
 */
export default class Pipeline {
    private _onLayout: (data: {
        position: vec2;
        limits: Rect;
    }) => Partial<{ size: Rect; position: vec2 }> | void;

    constructor() {
        this._onLayout = () => ({});
    }

    get onLayout() {
        return this._onLayout;
    }

    set onLayout(callback: Pipeline["_onLayout"]) {
        this._onLayout = callback;
    }
}
