import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mountBasic, mountSquare, unmountAll, wait } from "test/fixtures";
import PlaybackObject from "../playbackObject";
import { AnimationController } from "..";
import { BlankSystem, TestContinuousSystem, TestSystem } from "./TestSystem";
import { positionUntil, setTranslate, type Position } from "./Util";

/** How long an animation is allowed to run before a measurement is taken. */
const ANIMATING = 500;

describe("animation", () => {
    describe("unit", () => {
        describe("playback", () => {
            it("should call the playback hooks", () => {
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

            it("should have proper control state throughout animation", () => {
                class TestPlaybackObject extends PlaybackObject {}

                const player = new TestPlaybackObject();

                expect(player.status).toEqual({
                    started: false,
                    paused: false,
                });

                // pausing something that never started is a no-op
                player.pause();
                expect(player.status).toEqual({
                    started: false,
                    paused: false,
                });

                player.start();
                expect(player.status).toEqual({ started: true, paused: false });

                player.pause();
                expect(player.status).toEqual({ started: true, paused: true });

                player.play();
                expect(player.status).toEqual({ started: true, paused: false });

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
                expect(player.status).toEqual({ started: true, paused: false });

                // stopping clears a pause rather than remembering it
                player.pause();
                player.stop();
                expect(player.status).toEqual({
                    started: false,
                    paused: false,
                });
            });
        });

        describe("system", () => {
            it("should invoke onUpdate on update", () => {
                const system = new BlankSystem();
                system.start();

                system.update(10, 10);

                expect(system.t).toEqual(10);
                expect(system.dt).toEqual(10);

                system.stop();
            });

            it("should invoke onDraw on draw", () => {
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
            let square: HTMLElement;
            let marquee: HTMLElement;
            let squareSystem: TestSystem;
            let basicSystem: TestSystem;

            beforeEach(() => {
                square = mountSquare();
                marquee = mountBasic();

                setTranslate(square, [0, 0]);
                setTranslate(marquee, [0, 0]);

                squareSystem = new TestSystem(square);
                basicSystem = new TestSystem(marquee);

                squareSystem.start();
                basicSystem.start();

                squareSystem.position = [0, 0];
                basicSystem.position = [0, 0];

                AnimationController.registerSystem(squareSystem);
                AnimationController.registerSystem(basicSystem);
            });

            afterEach(() => {
                AnimationController.stop();

                squareSystem.stop();
                basicSystem.stop();

                AnimationController.deregisterSystem(squareSystem);
                AnimationController.deregisterSystem(basicSystem);

                unmountAll();
            });

            it("should animate independent of each system", async () => {
                const SQUARE_DESTINATION: Position = [100, 100];
                const BASIC_DESTINATION: Position = [300, 300];

                squareSystem.destination = SQUARE_DESTINATION;
                basicSystem.destination = BASIC_DESTINATION;

                AnimationController.start();

                const squareResult = await positionUntil(
                    square,
                    ([x, y]) =>
                        x >= SQUARE_DESTINATION[0] && y >= SQUARE_DESTINATION[1]
                );
                const basicResult = await positionUntil(
                    marquee,
                    ([x, y]) =>
                        x >= BASIC_DESTINATION[0] && y >= BASIC_DESTINATION[1]
                );

                AnimationController.stop();

                expect(squareResult).not.toEqual(basicResult);
            });

            it("should animate horizontally", async () => {
                squareSystem.destination[0] = 100;
                AnimationController.start();

                let result = await positionUntil(square, ([x]) => x >= 100);
                expect(result[0]).toBeCloseTo(100);

                AnimationController.stop();

                squareSystem.destination[0] = -100;
                AnimationController.start();

                result = await positionUntil(square, ([x]) => x <= -100);
                expect(result[0]).toBeCloseTo(-100, 0);
            });

            it("should animate vertically", async () => {
                squareSystem.destination[1] = 100;
                AnimationController.start();

                let result = await positionUntil(square, ([, y]) => y >= 100);
                expect(result[1]).toBeCloseTo(100);

                AnimationController.stop();

                squareSystem.destination[1] = -100;
                AnimationController.start();

                result = await positionUntil(square, ([, y]) => y <= -100);
                expect(result[1]).toBeCloseTo(-100, 0);
            });
        });

        describe("playback", () => {
            let squareSystem: TestContinuousSystem;
            let basicSystem: TestContinuousSystem;

            /** Snapshots where a system currently sits, detached from its live array. */
            const snapshot = (system: TestContinuousSystem): Position => [
                system.position[0],
                system.position[1],
            ];

            const expectMoved = (
                system: TestContinuousSystem,
                from: Position
            ) => {
                expect(system.position[0]).not.toBeCloseTo(from[0], 0);
                expect(system.position[1]).not.toBeCloseTo(from[1], 0);
            };

            const expectStill = (
                system: TestContinuousSystem,
                from: Position
            ) => {
                expect(system.position[0]).toBeCloseTo(from[0], 0);
                expect(system.position[1]).toBeCloseTo(from[1], 0);
            };

            beforeEach(() => {
                squareSystem = new TestContinuousSystem(mountSquare(), 100);
                basicSystem = new TestContinuousSystem(mountBasic(), 200);

                AnimationController.registerSystem(squareSystem);
                AnimationController.registerSystem(basicSystem);
                AnimationController.start();
            });

            afterEach(() => {
                AnimationController.stop();
                AnimationController.deregisterSystem(squareSystem);
                AnimationController.deregisterSystem(basicSystem);

                unmountAll();
            });

            it("should start and stop an animation", async () => {
                let reference = snapshot(squareSystem);

                squareSystem.start();
                await wait(ANIMATING);
                expectMoved(squareSystem, reference);

                await wait(ANIMATING);

                reference = snapshot(squareSystem);
                squareSystem.stop();
                await wait(ANIMATING);
                expectStill(squareSystem, reference);
            });

            it("should interrupt and continue an animation", async () => {
                squareSystem.start();
                await wait(ANIMATING);

                squareSystem.pause();
                const reference = snapshot(squareSystem);

                await wait(ANIMATING);
                expectStill(squareSystem, reference);

                squareSystem.play();
                await wait(ANIMATING);
                expectMoved(squareSystem, reference);

                squareSystem.stop();
            });

            it("should only control playback independently between systems", async () => {
                const squareRef = snapshot(squareSystem);
                let basicRef = snapshot(basicSystem);

                // start both at the same time
                squareSystem.start();
                basicSystem.start();
                await wait(ANIMATING);

                // stop one while the other keeps going
                basicSystem.stop();
                expectMoved(basicSystem, basicRef);
                basicRef = snapshot(basicSystem);

                await wait(ANIMATING);

                squareSystem.stop();
                basicSystem.stop();

                expectMoved(squareSystem, squareRef);
                expectStill(basicSystem, basicRef);
            });

            it("should restart if previously stopped", async () => {
                let reference = snapshot(squareSystem);

                squareSystem.start();
                await wait(ANIMATING);
                expectMoved(squareSystem, reference);

                reference = snapshot(squareSystem);
                squareSystem.stop();
                await wait(ANIMATING);
                expectStill(squareSystem, reference);

                reference = snapshot(squareSystem);
                squareSystem.start();
                await wait(ANIMATING);
                expectMoved(squareSystem, reference);

                squareSystem.stop();
            });

            describe("controller", () => {
                it("should start and stop all animations", async () => {
                    let squareRef = snapshot(squareSystem);
                    let basicRef = snapshot(basicSystem);

                    AnimationController.start();
                    squareSystem.start();
                    basicSystem.start();

                    await wait(ANIMATING);
                    expectMoved(squareSystem, squareRef);
                    expectMoved(basicSystem, basicRef);

                    await wait(ANIMATING);

                    squareRef = snapshot(squareSystem);
                    basicRef = snapshot(basicSystem);
                    AnimationController.stop();

                    expectStill(squareSystem, squareRef);
                    expectStill(basicSystem, basicRef);

                    await wait(ANIMATING);

                    // play cannot resurrect a stopped controller
                    AnimationController.play();

                    expectStill(squareSystem, squareRef);
                    expectStill(basicSystem, basicRef);
                });

                it("should play and pause all animations", async () => {
                    let squareRef = snapshot(squareSystem);
                    let basicRef = snapshot(basicSystem);

                    AnimationController.start();
                    AnimationController.pause();
                    squareSystem.start();
                    basicSystem.start();

                    await wait(ANIMATING);
                    expectStill(squareSystem, squareRef);
                    expectStill(basicSystem, basicRef);

                    AnimationController.play();

                    await wait(ANIMATING);
                    expectMoved(squareSystem, squareRef);
                    expectMoved(basicSystem, basicRef);

                    await wait(ANIMATING);

                    squareRef = snapshot(squareSystem);
                    basicRef = snapshot(basicSystem);
                    AnimationController.pause();

                    expectStill(squareSystem, squareRef);
                    expectStill(basicSystem, basicRef);

                    await wait(ANIMATING);

                    expectStill(squareSystem, squareRef);
                    expectStill(basicSystem, basicRef);
                });

                it("should start an animation after stopping", async () => {
                    let squareRef = snapshot(squareSystem);
                    let basicRef = snapshot(basicSystem);

                    AnimationController.start();
                    squareSystem.start();
                    basicSystem.start();

                    await wait(ANIMATING);
                    expectMoved(squareSystem, squareRef);
                    expectMoved(basicSystem, basicRef);

                    await wait(ANIMATING);

                    squareRef = snapshot(squareSystem);
                    basicRef = snapshot(basicSystem);
                    AnimationController.stop();

                    expectStill(squareSystem, squareRef);
                    expectStill(basicSystem, basicRef);

                    await wait(ANIMATING);

                    AnimationController.start();

                    await wait(ANIMATING);
                    expectMoved(squareSystem, squareRef);
                    expectMoved(basicSystem, basicRef);
                });
            });
        });
    });
});
