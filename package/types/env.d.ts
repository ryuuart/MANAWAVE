interface Rect {
    width: number;
    height: number;
}

interface Positionable {
    position: vec2;
}

type vec2 = {
    x: number;
    y: number;
};

type DirectionalCount = {
    horizontal: number;
    vertical: number;
};

type BoundingBox = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};

// HOOKS
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

type PipelineHooksMap = {
    onLayout: LayoutHook;
    onMove: MoveHook;
    onLoop: LoopHook;
    onElementCreated: ElementCreatedHook;
    onElementDraw: ElementDrawHook;
    onElementDestroyed: ElementDestroyedHook;
    eachElement: EachElementHook;
};

declare namespace manawave {
    type Options = {
        autoplay: boolean;
        direction: "up" | "right" | "down" | "left" | string | number;
        speed: number;
    } & Omit<PipelineHooksMap, "eachElement">;
}

declare namespace Ticker {
    type Sizes = {
        ticker: Rect;
        item: Rect;
    };

    type Attributes = {
        speed: number;
        direction: number;
    };
}
