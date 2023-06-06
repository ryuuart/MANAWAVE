interface Rect {
    width: number;
    height: number;
}

interface Positionable {
    position: vec2;
}

interface Listener {
    onMessage: (message: string, payload: any) => void;
}

type vec2 = {
    x: number;
    y: number;
};

type DirectionalCount = {
    horizontal: number;
    vertical: number;
};
