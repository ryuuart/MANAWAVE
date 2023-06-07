export type ItemStatus = "STARTED" | "LOOPED" | "NONE";

export class Item implements Positionable {
    id: string;
    lifetime: DOMHighResTimeStamp;
    position: vec2;
    status: ItemStatus;

    constructor() {
        this.lifetime = 0;
        this.position = {
            x: 0,
            y: 0,
        };
        this.status = "STARTED";
        this.id = uid();
    }
}
