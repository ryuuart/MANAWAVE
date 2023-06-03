export class Item implements Positionable {
    lifetime: DOMHighResTimeStamp;
    x: number;
    y: number;

    constructor() {
        this.lifetime = 0;
        this.x = 0;
        this.y = 0;
    }
}

export function extractPosition(item: Item): vec2 {
    return { x: item.x, y: item.y };
}
