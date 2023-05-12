import AnimationController from "@billboard/anim/AnimationController";
import { lerp } from "@billboard/anim/Util";
import { setTranslate } from "@billboard/dom";
import { System } from "@billboard/lib";
import Square from "test/pages/square/Square";

class TestContinuousSystem extends System {
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

    update(dt: number, t: number): void {
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

    draw() {
        setTranslate(this.element, this.position);
    }
}

let squareSystem: TestContinuousSystem;

describe("playback with animations", () => {
    beforeEach(() => {
        Square.loadContent();
        setTranslate(Square.square, [0, 0]);

        squareSystem = new TestContinuousSystem(Square.square, 300);

        AnimationController.registerSystem(squareSystem);
        AnimationController.start();
    });
    afterEach(() => {
        AnimationController.stop();
        AnimationController.deregisterSystem(squareSystem);

        Square.clearContent();
    });

    it("should interrupt and continue an animation", async () => {});

    // it("should start and stop an animation", async () => {});
});
