interface Rect {
    width: number;
    height: number;
}

interface Positionable {
    x: number;
    y: number;
}

interface RepetitionCount {
    horizontal: number;
    vertical: number;
}

interface GridProperties {
    grid: {
        size: Rect;
    };
    item: {
        size: Rect;
    };
    repetitions: RepetitionCount;
}
