import Square from "test/pages/square/Square";
import AnimationPlayer from "../AnimationPlayer";
import { setTranslate } from "@billboard/dom";
import AnimationController from "../AnimationController";
import { System } from "@billboard/lib";
import { lerp } from "../Util";

function getPositionFromMatrix(matrix: string): Position {
    const parsed = matrix.match(/-?\d+/g)!;

    return [parseFloat(parsed[4]), parseFloat(parsed[5])];
}

class TestAnimationSystem extends System {
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

let system: TestAnimationSystem;

describe("animation system", () => {
    beforeEach(() => {
        Square.loadContent();
        setTranslate(Square.square, [0, 0]);

        system = new TestAnimationSystem(Square.square);
        system.position = [0, 0];
        AnimationController.registerSystem(system);
    });
    afterEach(() => {
        Square.clearContent();
        AnimationController.deregisterSystem(system);
    });

    describe("player", () => {
        it("should have proper control state throughout animation", async () => {
            const player = new AnimationPlayer();

            expect(player.status).toEqual({
                started: false,
                paused: false,
            });

            player.pause();

            expect(player.status).toEqual({
                started: false,
                paused: false,
            });

            player.start();

            expect(player.status).toEqual({
                started: true,
                paused: false,
            });

            player.pause();

            expect(player.status).toEqual({
                started: true,
                paused: true,
            });

            player.play();

            expect(player.status).toEqual({
                started: true,
                paused: false,
            });

            player.stop();

            expect(player.status).toEqual({
                started: false,
                paused: false,
            });

            player.pause();

            expect(player.status).toEqual({
                started: false,
                paused: false,
            });

            player.start();

            expect(player.status).toEqual({
                started: true,
                paused: false,
            });

            player.pause();
            player.stop();

            expect(player.status).toEqual({
                started: false,
                paused: false,
            });
        });
    });

    it("should animate horizontally", async () => {
        let DESTINATION = 100;
        const element = await $("#square");

        system.destination[0] = DESTINATION;
        AnimationController.start();

        let result;

        result = await browser.waitUntil(async () => {
            const transform = await element.getCSSProperty("transform");
            const position = getPositionFromMatrix(transform.value!);

            if (position[0] >= DESTINATION) return position[0];
        });

        expect(result).toBeCloseTo(DESTINATION);

        AnimationController.stop();

        DESTINATION = -100;
        system.destination[0] = DESTINATION;
        AnimationController.start();

        result = await browser.waitUntil(async () => {
            const transform = await element.getCSSProperty("transform");
            const position = getPositionFromMatrix(transform.value!);

            if (position[0] <= DESTINATION) return position[0];
        });

        expect(result).toBeCloseTo(DESTINATION);
    });

    it("should animate vertically", async () => {
        let DESTINATION = 100;
        const element = await $("#square");

        system.destination[1] = DESTINATION;
        AnimationController.start();

        let result;

        result = await browser.waitUntil(async () => {
            const transform = await element.getCSSProperty("transform");
            const position = getPositionFromMatrix(transform.value!);

            if (position[1] >= DESTINATION) return position[1];
        });

        expect(result).toBeCloseTo(DESTINATION);

        AnimationController.stop();

        DESTINATION = -100;
        system.destination[1] = DESTINATION;
        system.start();

        result = await browser.waitUntil(async () => {
            const transform = await element.getCSSProperty("transform");
            const position = getPositionFromMatrix(transform.value!);

            if (position[1] <= DESTINATION) return position[1];
        });

        expect(result).toBeCloseTo(DESTINATION);
    });
});
