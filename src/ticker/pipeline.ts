type LayoutHook = (data: {
    position: vec2;
    limits: Rect;
}) => Partial<{ size: Rect; position: vec2 }> | void;
type MoveHook = (data: {
    direction: number;
    dt: DOMHighResTimeStamp;
    t: DOMHighResTimeStamp;
}) => Partial<{
    direction: number;
}> | void;

export type PipelineHooksMap = {
    layout: LayoutHook;
    move: MoveHook;
};

/**
 * Represents the series of hooks and user-provided transformations
 * on the default data / configuration of the Ticker
 */
export class Pipeline {
    onLayout: PipelineHooksMap["layout"];
    onMove: PipelineHooksMap["move"];

    constructor() {
        this.onLayout = () => {};
        this.onMove = () => {};
    }
}
