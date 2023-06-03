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
