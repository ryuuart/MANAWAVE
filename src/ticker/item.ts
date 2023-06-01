export class Item implements Rect, Positionable {
    width: number;
    height: number;
    x: number;
    y: number;

    constructor() {
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
    }
}
