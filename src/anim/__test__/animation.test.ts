import Square from "test/pages/square/Square";
import PlaybackObject from "../PlaybackObject";
import { setTranslate } from "@billboard/dom";
import AnimationController from "../AnimationController";
import TestSystem from "./TestSystem";
import Basic from "test/pages/basic/Basic";

function getPositionFromMatrix(matrix: string): Position {
    const parsed = matrix.match(/-?\d+/g)!;

    return [parseFloat(parsed[4]), parseFloat(parsed[5])];
}

async function getPositionUntil(
    element: WebdriverIO.Element,
    condition: (position: Position) => boolean
): Promise<Position | undefined> {
    const result = await browser.waitUntil(async () => {
        const transform = await element.getCSSProperty("transform");
        const position = getPositionFromMatrix(transform.value!);

        if (condition(position)) return position;
    });

    return result;
}

let squareSystem: TestSystem;
let basicSystem: TestSystem;

describe("animation system", () => {
    beforeEach(() => {
        Square.loadContent();
        Basic.loadContent();
        setTranslate(Square.square, [0, 0]);
        setTranslate(Basic.ticker, [0, 0]);

        squareSystem = new TestSystem(Square.square);
        basicSystem = new TestSystem(Basic.ticker);

        squareSystem.position = [0, 0];
        basicSystem.position = [0, 0];

        AnimationController.registerSystem(squareSystem);
        AnimationController.registerSystem(basicSystem);
    });
    afterEach(() => {
        AnimationController.stop();

        Square.clearContent();
        Basic.clearContent();

        AnimationController.deregisterSystem(squareSystem);
        AnimationController.deregisterSystem(basicSystem);
    });

    describe("player", () => {
        it("should call the playback hooks", async () => {
            class TestPlaybackObject extends PlaybackObject {
                testStatus: string = "";

                onStart() {
                    this.testStatus = "CUSTOM START LOGIC";
                }

                onPause(): void {
                    this.testStatus = "CUSTOM PAUSE LOGIC";
                }

                onPlay(): void {
                    this.testStatus = "CUSTOM PLAY LOGIC";
                }

                onStop(): void {
                    this.testStatus = "CUSTOM STOP LOGIC";
                }
            }

            const player = new TestPlaybackObject();

            player.start();

            expect(player.testStatus).toEqual("CUSTOM START LOGIC");

            player.pause();

            expect(player.testStatus).toEqual("CUSTOM PAUSE LOGIC");

            player.play();

            expect(player.testStatus).toEqual("CUSTOM PLAY LOGIC");

            player.stop();

            expect(player.testStatus).toEqual("CUSTOM STOP LOGIC");
        });

        it("should have proper control state throughout animation", async () => {
            class TestPlaybackObject extends PlaybackObject {}

            const player = new TestPlaybackObject();

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

    it("should animate independent of each system", async () => {
        let SQUARE_DESTINATION: Position = [100, 100];
        let BASIC_DESTINATION: Position = [300, 300];

        squareSystem.destination = SQUARE_DESTINATION;
        basicSystem.destination = BASIC_DESTINATION;

        AnimationController.start();

        const squareElement = await $("#square");
        const squareResult = await getPositionUntil(
            squareElement,
            (position) => {
                return (
                    position[0] >= SQUARE_DESTINATION[0] &&
                    position[1] >= SQUARE_DESTINATION[1]
                );
            }
        );

        const basicElement = await $("#ticker");
        const basicResult = await getPositionUntil(basicElement, (position) => {
            return (
                position[0] >= BASIC_DESTINATION[0] &&
                position[1] >= BASIC_DESTINATION[1]
            );
        });

        AnimationController.stop();

        expect(squareResult).not.toEqual(basicResult);
    });

    it("should animate horizontally", async () => {
        let DESTINATION = 100;
        const element = await $("#square");
        let result;

        squareSystem.destination[0] = DESTINATION;
        AnimationController.start();

        result = await getPositionUntil(element, (position) => {
            return position[0] >= DESTINATION;
        });

        expect(result![0]).toBeCloseTo(DESTINATION);

        AnimationController.stop();

        DESTINATION = -100;
        squareSystem.destination[0] = DESTINATION;

        AnimationController.start();

        result = await getPositionUntil(element, (position) => {
            return position[0] <= DESTINATION;
        });

        expect(result![0]).toBeCloseTo(DESTINATION);
    });

    it("should animate vertically", async () => {
        let DESTINATION = 100;
        const element = await $("#square");
        let result;

        squareSystem.destination[1] = DESTINATION;
        AnimationController.start();

        result = await getPositionUntil(element, (position) => {
            return position[1] >= DESTINATION;
        });

        expect(result![1]).toBeCloseTo(DESTINATION);

        AnimationController.stop();

        DESTINATION = -100;
        squareSystem.destination[1] = DESTINATION;

        AnimationController.start();

        result = await getPositionUntil(element, (position) => {
            return position[1] <= DESTINATION;
        });

        expect(result![1]).toBeCloseTo(DESTINATION);
    });
});
