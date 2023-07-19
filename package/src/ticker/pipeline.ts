// invoked when all items are positioned
type LayoutHook = (data: {
    position: vec2;
    limits: Rect;
}) => Partial<{ size: Rect; position: vec2 }> | void;

// invoked when the logical item moves
type MoveHook = (data: {
    direction: number;
    speed: number;
    dt: DOMHighResTimeStamp;
    t: DOMHighResTimeStamp;
}) => Partial<{
    direction: number;
}> | void;

// invoked when the logical item loops
type LoopHook = (data: {
    limits: BoundingBox;
    itemSize: Rect;
    tickerSize: Rect;
    direction: vec2;
}) => Partial<{ limits: BoundingBox }> | void;

// invoked when the item DOM element gets created
type ElementCreatedHook = (data: {
    element: HTMLElement;
    id: string;
}) => Partial<{ element: HTMLElement }> | void;

// invoked when the item DOM element gets updated
type ElementDrawHook = (data: {
    element: HTMLElement;
    id: string;
    dt: DOMHighResTimeStamp;
    t: DOMHighResTimeStamp;
}) => void;

// invoked when the item DOM element gets destroyed
type ElementDestroyedHook = (data: {
    element: HTMLElement;
    id: string;
}) => void;

// invoked on every element when desired
type EachElementHook = (data: { element: HTMLElement; id: string }) => void;

export type PipelineHooksMap = {
    layout: LayoutHook;
    move: MoveHook;
    loop: LoopHook;
    elementCreated: ElementCreatedHook;
    elementDraw: ElementDrawHook;
    elementDestroyed: ElementDestroyedHook;
    eachElement: EachElementHook;
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
    onElementDraw: PipelineHooksMap["elementDraw"];
    onElementDestroyed: PipelineHooksMap["elementDestroyed"];

    constructor() {
        this.onLayout = () => {};
        this.onMove = () => {};
        this.onLoop = () => {};
        this.onElementCreated = () => {};
        this.onElementDraw = () => {};
        this.onElementDestroyed = () => {};
    }
}
