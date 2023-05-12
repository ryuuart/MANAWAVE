import AnimationController from "@billboard/anim/AnimationController";
import { lerp } from "@billboard/anim/Util";
import { setTranslate } from "@billboard/dom";
import { System } from "@billboard/lib";
import Basic from "test/pages/basic/Basic";
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

    onUpdate(dt: number, t: number): void {
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

let squareSystem: TestContinuousSystem;
let basicSystem: TestContinuousSystem;

describe("playback with animations", () => {
    beforeEach(() => {
        Square.loadContent();
        Basic.loadContent();

        squareSystem = new TestContinuousSystem(Square.square, 100);
        basicSystem = new TestContinuousSystem(Basic.ticker, 200);

        AnimationController.registerSystem(squareSystem);
        AnimationController.registerSystem(basicSystem);
        AnimationController.start();
    });
    afterEach(() => {
        AnimationController.stop();
        AnimationController.deregisterSystem(squareSystem);
        AnimationController.deregisterSystem(basicSystem);

        Square.clearContent();
        Basic.clearContent();
    });

    it("should start and stop an animation", async () => {
        let reference: Position = [
            squareSystem.position[0],
            squareSystem.position[1],
        ];

        squareSystem.start();

        await browser.pause(500);

        expect(squareSystem.position[0]).not.toBeCloseTo(reference[0]);
        expect(squareSystem.position[1]).not.toBeCloseTo(reference[1]);

        await browser.pause(500);

        reference = [squareSystem.position[0], squareSystem.position[1]];
        squareSystem.stop();

        await browser.pause(500);

        expect(squareSystem.position[0]).toBeCloseTo(reference[0]);
        expect(squareSystem.position[1]).toBeCloseTo(reference[1]);
    });

    it("should interrupt and continue an animation", async () => {
        let reference: Position;
        squareSystem.start();

        await browser.pause(500);

        squareSystem.pause();
        reference = [squareSystem.position[0], squareSystem.position[1]];

        await browser.pause(500);

        expect(squareSystem.position[0]).toBeCloseTo(reference[0]);
        expect(squareSystem.position[1]).toBeCloseTo(reference[1]);

        squareSystem.play();

        await browser.pause(500);

        expect(squareSystem.position[0]).not.toBeCloseTo(reference[0]);
        expect(squareSystem.position[1]).not.toBeCloseTo(reference[1]);

        squareSystem.stop();
    });

    it("should only control playback independently between systems", async () => {
        let squareRef: Position = [
            squareSystem.position[0],
            squareSystem.position[1],
        ];
        let basicRef: Position = [
            basicSystem.position[0],
            basicSystem.position[1],
        ];

        // Start both at the same time
        squareSystem.start();
        basicSystem.start();

        // animate for a bit...
        await browser.pause(500);

        // alright stop one while the other continues
        basicSystem.stop();

        // while it did stop, it should have also animated a little
        expect(basicSystem.position[0]).not.toBeCloseTo(basicRef[0]);
        expect(basicSystem.position[1]).not.toBeCloseTo(basicRef[1]);
        basicRef = [basicSystem.position[0], basicSystem.position[1]];

        await browser.pause(500);

        // Ok we're done
        squareSystem.stop();
        basicSystem.stop();

        // one that is animating should have been animating
        expect(squareSystem.position[0]).not.toBeCloseTo(squareRef[0]);
        expect(squareSystem.position[1]).not.toBeCloseTo(squareRef[1]);

        // one that stopped should have stopped
        expect(basicSystem.position[0]).toBeCloseTo(basicRef[0]);
        expect(basicSystem.position[1]).toBeCloseTo(basicRef[1]);
    });

    it("should restart if previously stopped", async () => {
        let reference: Position = [
            squareSystem.position[0],
            squareSystem.position[1],
        ];

        squareSystem.start();

        await browser.pause(500);

        // we animated
        expect(squareSystem.position[0]).not.toBeCloseTo(reference[0]);
        expect(squareSystem.position[1]).not.toBeCloseTo(reference[1]);

        reference = [squareSystem.position[0], squareSystem.position[1]];
        squareSystem.stop();

        await browser.pause(500);

        // we stopped
        expect(squareSystem.position[0]).toBeCloseTo(reference[0]);
        expect(squareSystem.position[1]).toBeCloseTo(reference[1]);

        reference = [squareSystem.position[0], squareSystem.position[1]];
        squareSystem.start();

        await browser.pause(500);

        // we restarted
        expect(squareSystem.position[0]).not.toBeCloseTo(reference[0]);
        expect(squareSystem.position[1]).not.toBeCloseTo(reference[1]);
        squareSystem.stop();
    });
});
