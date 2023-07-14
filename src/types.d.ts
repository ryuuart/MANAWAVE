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

namespace manawave {
    type Options = {
        autoplay: boolean;
        direction: "up" | "right" | "down" | "left" | string | number;
        speed: number;
    };
}

namespace Ticker {
    type Sizes = {
        ticker: Rect;
        item: Rect;
    };

    type Attributes = {
        speed: number;
        direction: number;
    };
}
