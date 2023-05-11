import { System } from "@billboard/lib";
import { lerp } from "../Util";
import { setTranslate } from "@billboard/dom";

export default class TestSystem extends System {
    destination: Position;
    position: Position;
    element: Element;

    constructor(element: Element) {
        super();

        this.position = [-999, -999];
        this.destination = [0, 0];
        this.element = element;
    }

    update(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
        this.position[0] = lerp(
            this.position[0],
            this.destination[0],
            dt * 0.01
        );
        this.position[1] = lerp(
            this.position[1],
            this.destination[1],
            dt * 0.01
        );
    }

    draw() {
        setTranslate(this.element, this.position);
    }
}
