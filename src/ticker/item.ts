export class Item implements Positionable {
    lifetime: DOMHighResTimeStamp;
    position: vec2;

    constructor() {
        this.lifetime = 0;
        this.position = {
            x: 0,
            y: 0,
        };
    }
}
