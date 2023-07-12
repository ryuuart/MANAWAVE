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

type LoopHook = (data: {
    limits: BoundingBox;
    itemSize: Rect;
    tickerSize: Rect;
    direction: vec2;
}) => Partial<{ limits: BoundingBox }> | void;

type ElementCreatedHook = (data: {
    element: HTMLElement;
    id: string;
}) => Partial<{ element: HTMLElement }> | void;

export type PipelineHooksMap = {
    layout: LayoutHook;
    move: MoveHook;
    loop: LoopHook;
    elementCreated: ElementCreatedHook;
};

/**
 * Represents the series of hooks and user-provided transformations
 * on the default data / configuration of the Ticker
 */
export class Pipeline {
    onLayout: PipelineHooksMap["layout"];
    onMove: PipelineHooksMap["move"];
    onLoop: PipelineHooksMap["loop"];
    onElementCreated: PipelineHooksMap["elementCreated"];

    constructor() {
        this.onLayout = () => {};
        this.onMove = () => {};
        this.onLoop = () => {};
        this.onElementCreated = () => {};
    }
}
