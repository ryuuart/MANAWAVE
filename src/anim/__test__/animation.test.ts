import Square from "test/pages/square/Square";
import AnimationController from "../AnimationController";
import { setTranslate } from "@billboard/dom";

function lerp(v0: number, v1: number, t: number) {
    return v0 * (1 - t) + v1 * t;
}

function getPositionFromMatrix(matrix: string): Position {
    const position: Position = [-9999, -9999];
    const parsed = matrix.match(/-?\d+/g)!;

    return [parseFloat(parsed[4]), parseFloat(parsed[5])];
}

describe("animation system", () => {
    beforeEach(() => {
        Square.loadContent();
        setTranslate(Square.square, [0, 0]);
    });
    afterEach(() => {
        Square.clearContent();
    });

    it("should animate horizontally", async () => {
        let DESTINATION = 100;
        const element = await $("#square");

        let animationController = new AnimationController();
        animationController.addAnimation({
            ref: Square.square,
            position: [0, 0],
            update: function (dt) {
                this.position[0] = lerp(
                    this.position[0],
                    DESTINATION,
                    dt * 0.01
                );
            },
            draw: function () {
                setTranslate(this.ref, this.position);
            },
        });

        animationController.start();

        let result;

        result = await browser.waitUntil(async () => {
            const transform = await element.getCSSProperty("transform");
            const position = getPositionFromMatrix(transform.value!);

            return position[0] >= DESTINATION;
        });

        expect(result).toBeTruthy();

        animationController.stop();

        DESTINATION = -100;
        animationController.start();

        result = await browser.waitUntil(async () => {
            const transform = await element.getCSSProperty("transform");
            const position = getPositionFromMatrix(transform.value!);

            return position[0] <= DESTINATION;
        });

        expect(result).toBeTruthy();
    });

    it("should animate vertically", async () => {
        let DESTINATION = 100;
        const element = await $("#square");

        let animationController = new AnimationController();
        animationController.addAnimation({
            ref: Square.square,
            position: [0, 0],
            update: function (dt) {
                this.position[1] = lerp(
                    this.position[1],
                    DESTINATION,
                    dt * 0.01
                );
            },
            draw: function () {
                setTranslate(this.ref, this.position);
            },
        });

        animationController.start();

        let result;

        result = await browser.waitUntil(async () => {
            const transform = await element.getCSSProperty("transform");
            const position = getPositionFromMatrix(transform.value!);

            return position[1] >= DESTINATION;
        });

        expect(result).toBeTruthy();

        animationController.stop();

        DESTINATION = -100;
        animationController.start();

        result = await browser.waitUntil(async () => {
            const transform = await element.getCSSProperty("transform");
            const position = getPositionFromMatrix(transform.value!);

            return position[1] <= DESTINATION;
        });

        expect(result).toBeTruthy();
    });
});
