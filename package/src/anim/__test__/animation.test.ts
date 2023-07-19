import Square from "test/pages/square/Square";
import PlaybackObject from "../playbackObject";
import { BlankSystem, TestContinuousSystem, TestSystem } from "./TestSystem";
import Basic from "test/pages/basic/Basic";
import { Position, getPositionUntil, setTranslate } from "./Util";
import { AnimationController } from "..";

describe("animation", () => {
    describe("unit", () => {
        describe("playback", () => {
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

        describe("system", () => {
            it("should invoke onUpdate on update", async () => {
                const system = new BlankSystem();
                system.start();

                system.update(10, 10);

                expect(system.t).toEqual(10);
                expect(system.dt).toEqual(10);

                system.stop();
            });

            it("should invoke onDraw on draw", async () => {
                const system = new BlankSystem();
                system.start();

                system.draw();

                expect(system.stringCanvas).toEqual("rendered");

                system.stop();
            });
        });
    });

    describe("integration", () => {
        describe("system", () => {
            let squareSystem: TestSystem;
            let basicSystem: TestSystem;

            beforeEach(() => {
                Square.loadContent();
                Basic.loadContent();
                setTranslate(Square.square!, [0, 0]);
                setTranslate(Basic.ticker!, [0, 0]);

                squareSystem = new TestSystem(Square.square!);
                basicSystem = new TestSystem(Basic.ticker!);

                squareSystem.start();
                basicSystem.start();

                squareSystem.position = [0, 0];
                basicSystem.position = [0, 0];

                AnimationController.registerSystem(squareSystem);
                AnimationController.registerSystem(basicSystem);
            });
            afterEach(() => {
                AnimationController.stop();

                Square.clearContent();
                Basic.clearContent();

                squareSystem.stop();
                basicSystem.stop();

                AnimationController.deregisterSystem(squareSystem);
                AnimationController.deregisterSystem(basicSystem);
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
                const basicResult = await getPositionUntil(
                    basicElement,
                    (position) => {
                        return (
                            position[0] >= BASIC_DESTINATION[0] &&
                            position[1] >= BASIC_DESTINATION[1]
                        );
                    }
                );

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

                expect(result![0]).toBeCloseTo(DESTINATION, 0);
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

                expect(result![1]).toBeCloseTo(DESTINATION, 0);
            });
        });

        describe("playback", () => {
            let squareSystem: TestContinuousSystem;
            let basicSystem: TestContinuousSystem;
            beforeEach(() => {
                Square.loadContent();
                Basic.loadContent();

                squareSystem = new TestContinuousSystem(Square.square!, 100);
                basicSystem = new TestContinuousSystem(Basic.ticker!, 200);

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

                expect(squareSystem.position[0]).not.toBeCloseTo(
                    reference[0],
                    0
                );
                expect(squareSystem.position[1]).not.toBeCloseTo(
                    reference[1],
                    0
                );

                await browser.pause(500);

                reference = [
                    squareSystem.position[0],
                    squareSystem.position[1],
                ];
                squareSystem.stop();

                await browser.pause(500);

                expect(squareSystem.position[0]).toBeCloseTo(reference[0], 0);
                expect(squareSystem.position[1]).toBeCloseTo(reference[1], 0);
            });

            it("should interrupt and continue an animation", async () => {
                let reference: Position;
                squareSystem.start();

                await browser.pause(500);

                squareSystem.pause();
                reference = [
                    squareSystem.position[0],
                    squareSystem.position[1],
                ];

                await browser.pause(500);

                expect(squareSystem.position[0]).toBeCloseTo(reference[0], 0);
                expect(squareSystem.position[1]).toBeCloseTo(reference[1], 0);

                squareSystem.play();

                await browser.pause(500);

                expect(squareSystem.position[0]).not.toBeCloseTo(
                    reference[0],
                    0
                );
                expect(squareSystem.position[1]).not.toBeCloseTo(
                    reference[1],
                    0
                );

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
                expect(basicSystem.position[0]).not.toBeCloseTo(basicRef[0], 0);
                expect(basicSystem.position[1]).not.toBeCloseTo(basicRef[1], 0);
                basicRef = [basicSystem.position[0], basicSystem.position[1]];

                await browser.pause(500);

                // Ok we're done
                squareSystem.stop();
                basicSystem.stop();

                // one that is animating should have been animating
                expect(squareSystem.position[0]).not.toBeCloseTo(
                    squareRef[0],
                    0
                );
                expect(squareSystem.position[1]).not.toBeCloseTo(
                    squareRef[1],
                    0
                );

                // one that stopped should have stopped
                expect(basicSystem.position[0]).toBeCloseTo(basicRef[0], 0);
                expect(basicSystem.position[1]).toBeCloseTo(basicRef[1], 0);
            });

            it("should restart if previously stopped", async () => {
                let reference: Position = [
                    squareSystem.position[0],
                    squareSystem.position[1],
                ];

                squareSystem.start();

                await browser.pause(500);

                // we animated
                expect(squareSystem.position[0]).not.toBeCloseTo(
                    reference[0],
                    0
                );
                expect(squareSystem.position[1]).not.toBeCloseTo(
                    reference[1],
                    0
                );

                reference = [
                    squareSystem.position[0],
                    squareSystem.position[1],
                ];
                squareSystem.stop();

                await browser.pause(500);

                // we stopped
                expect(squareSystem.position[0]).toBeCloseTo(reference[0], 0);
                expect(squareSystem.position[1]).toBeCloseTo(reference[1], 0);

                reference = [
                    squareSystem.position[0],
                    squareSystem.position[1],
                ];
                squareSystem.start();

                await browser.pause(500);

                // we restarted
                expect(squareSystem.position[0]).not.toBeCloseTo(
                    reference[0],
                    0
                );
                expect(squareSystem.position[1]).not.toBeCloseTo(
                    reference[1],
                    0
                );
                squareSystem.stop();
            });

            describe("controller", () => {
                it("should start and stop all animations", async () => {
                    let squareRef: Position = [
                        squareSystem.position[0],
                        squareSystem.position[1],
                    ];
                    let basicRef: Position = [
                        basicSystem.position[0],
                        basicSystem.position[1],
                    ];

                    AnimationController.start();
                    squareSystem.start();
                    basicSystem.start();

                    await browser.pause(500);

                    // all animations animated
                    expect(squareSystem.position[0]).not.toBeCloseTo(
                        squareRef[0],
                        0
                    );
                    expect(squareSystem.position[1]).not.toBeCloseTo(
                        squareRef[1],
                        0
                    );
                    expect(basicSystem.position[0]).not.toBeCloseTo(
                        basicRef[0],
                        0
                    );
                    expect(basicSystem.position[1]).not.toBeCloseTo(
                        basicRef[1],
                        0
                    );

                    await browser.pause(500);

                    squareRef = [
                        squareSystem.position[0],
                        squareSystem.position[1],
                    ];
                    basicRef = [
                        basicSystem.position[0],
                        basicSystem.position[1],
                    ];
                    AnimationController.stop();

                    // all animation stopped
                    expect(squareSystem.position[0]).toBeCloseTo(
                        squareRef[0],
                        0
                    );
                    expect(squareSystem.position[1]).toBeCloseTo(
                        squareRef[1],
                        0
                    );
                    expect(basicSystem.position[0]).toBeCloseTo(basicRef[0], 0);
                    expect(basicSystem.position[1]).toBeCloseTo(basicRef[1], 0);

                    await browser.pause(500);

                    AnimationController.play();

                    // still stopped
                    expect(squareSystem.position[0]).toBeCloseTo(
                        squareRef[0],
                        0
                    );
                    expect(squareSystem.position[1]).toBeCloseTo(
                        squareRef[1],
                        0
                    );
                    expect(basicSystem.position[0]).toBeCloseTo(basicRef[0], 0);
                    expect(basicSystem.position[1]).toBeCloseTo(basicRef[1], 0);
                });

                it("should play and pause all animations", async () => {
                    let squareRef: Position = [
                        squareSystem.position[0],
                        squareSystem.position[1],
                    ];
                    let basicRef: Position = [
                        basicSystem.position[0],
                        basicSystem.position[1],
                    ];

                    AnimationController.start();
                    AnimationController.pause();
                    squareSystem.start();
                    basicSystem.start();

                    await browser.pause(500);

                    // all animations paused
                    expect(squareSystem.position[0]).toBeCloseTo(
                        squareRef[0],
                        0
                    );
                    expect(squareSystem.position[1]).toBeCloseTo(
                        squareRef[1],
                        0
                    );
                    expect(basicSystem.position[0]).toBeCloseTo(basicRef[0], 0);
                    expect(basicSystem.position[1]).toBeCloseTo(basicRef[1], 0);

                    AnimationController.play();

                    await browser.pause(500);

                    // all animations animated
                    expect(squareSystem.position[0]).not.toBeCloseTo(
                        squareRef[0],
                        0
                    );
                    expect(squareSystem.position[1]).not.toBeCloseTo(
                        squareRef[1],
                        0
                    );
                    expect(basicSystem.position[0]).not.toBeCloseTo(
                        basicRef[0],
                        0
                    );
                    expect(basicSystem.position[1]).not.toBeCloseTo(
                        basicRef[1],
                        0
                    );

                    await browser.pause(500);

                    squareRef = [
                        squareSystem.position[0],
                        squareSystem.position[1],
                    ];
                    basicRef = [
                        basicSystem.position[0],
                        basicSystem.position[1],
                    ];
                    AnimationController.pause();

                    // all animation stopped
                    expect(squareSystem.position[0]).toBeCloseTo(
                        squareRef[0],
                        0
                    );
                    expect(squareSystem.position[1]).toBeCloseTo(
                        squareRef[1],
                        0
                    );
                    expect(basicSystem.position[0]).toBeCloseTo(basicRef[0], 0);
                    expect(basicSystem.position[1]).toBeCloseTo(basicRef[1], 0);

                    await browser.pause(500);

                    // still stopped
                    expect(squareSystem.position[0]).toBeCloseTo(
                        squareRef[0],
                        0
                    );
                    expect(squareSystem.position[1]).toBeCloseTo(
                        squareRef[1],
                        0
                    );
                    expect(basicSystem.position[0]).toBeCloseTo(basicRef[0], 0);
                    expect(basicSystem.position[1]).toBeCloseTo(basicRef[1], 0);
                });

                it("should start an animation after stopping", async () => {
                    let squareRef: Position = [
                        squareSystem.position[0],
                        squareSystem.position[1],
                    ];
                    let basicRef: Position = [
                        basicSystem.position[0],
                        basicSystem.position[1],
                    ];

                    AnimationController.start();
                    squareSystem.start();
                    basicSystem.start();

                    await browser.pause(500);

                    // all animations animated
                    expect(squareSystem.position[0]).not.toBeCloseTo(
                        squareRef[0],
                        0
                    );
                    expect(squareSystem.position[1]).not.toBeCloseTo(
                        squareRef[1],
                        0
                    );
                    expect(basicSystem.position[0]).not.toBeCloseTo(
                        basicRef[0],
                        0
                    );
                    expect(basicSystem.position[1]).not.toBeCloseTo(
                        basicRef[1],
                        0
                    );

                    await browser.pause(500);

                    squareRef = [
                        squareSystem.position[0],
                        squareSystem.position[1],
                    ];
                    basicRef = [
                        basicSystem.position[0],
                        basicSystem.position[1],
                    ];
                    AnimationController.stop();

                    // all animation stopped
                    expect(squareSystem.position[0]).toBeCloseTo(
                        squareRef[0],
                        0
                    );
                    expect(squareSystem.position[1]).toBeCloseTo(
                        squareRef[1],
                        0
                    );
                    expect(basicSystem.position[0]).toBeCloseTo(basicRef[0], 0);
                    expect(basicSystem.position[1]).toBeCloseTo(basicRef[1], 0);

                    await browser.pause(500);

                    AnimationController.start();

                    await browser.pause(500);

                    // all animations animated
                    expect(squareSystem.position[0]).not.toBeCloseTo(
                        squareRef[0],
                        0
                    );
                    expect(squareSystem.position[1]).not.toBeCloseTo(
                        squareRef[1],
                        0
                    );
                    expect(basicSystem.position[0]).not.toBeCloseTo(
                        basicRef[0],
                        0
                    );
                    expect(basicSystem.position[1]).not.toBeCloseTo(
                        basicRef[1],
                        0
                    );
                });
            });
        });
    });
});
