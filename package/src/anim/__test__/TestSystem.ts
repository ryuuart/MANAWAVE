import { System } from "..";
import { Position, lerp, setTranslate } from "./Util";

/**
 * A blank system that simulates a real system by modifying a string
 */
export class BlankSystem extends System {
    dt: DOMHighResTimeStamp;
    t: DOMHighResTimeStamp;
    stringCanvas: string;

    constructor() {
        super();

        this.dt = 0;
        this.t = 0;

        this.stringCanvas = "not rendered";
    }

    onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp): void {
        this.dt = dt;
        this.t = t;
    }

    onDraw(): void {
        this.stringCanvas = "rendered";
    }
}

export class TestSystem extends System {
    destination: Position;
    position: Position;
    element: Element;

    constructor(element: Element) {
        super();

        this.position = [-999, -999];
        this.destination = [0, 0];
        this.element = element;
    }

    onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
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

    onDraw() {
        setTranslate(this.element, this.position);
    }
}

/**
 * {@link System} that runs an animation continuously
 */
export class TestContinuousSystem extends System {
    position: Position;
    anchor: Position;
    element: Element;

    radius: number;

    constructor(element: Element, radius: number) {
        super();

        this.element = element;

        this.position = [0, 0];
        this.anchor = [0, 0];

        this.radius = radius;
    }

    /**
     *
     * @see {@link System.onUpdate}
     */
    onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp): void {
        this.position[0] = lerp(
            this.anchor[0],
            this.anchor[0] + this.radius,
            Math.cos(t * 0.01)
        );
        this.position[1] = lerp(
            this.anchor[1],
            this.anchor[1] + this.radius,
            Math.sin(t * 0.01)
        );
    }

    onDraw() {
        setTranslate(this.element, this.position);
    }
}
