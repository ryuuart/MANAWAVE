declare interface Dimensions {
    width: number;
    height: number;
}

declare interface DimensionsCount {
    x: number;
    y: number;
}

declare type Position = [x: number, y: number];

declare namespace Billboard {
    interface Options {
        autoplay?: true | false;
        speed?: number;
        direction?: "up" | "right" | "down" | "left" | number | string;
    }

    interface ItemState {
        dt: DOMHighResTimeStamp;
        t: DOMHighResTimeStamp;
        direction: [number, number];
        position: Position;
    }
}
