import allDirectionsSnapshot from "./data/all_direction.json";

import { Scene } from "../scene";
import { Simulation } from "../simulation";
import { Item } from "../item";
import { LiveAttributes, LiveSize } from "../context";
import { angleToDirection } from "../math";
import { Pipeline } from "../pipeline";

describe("marquee", () => {
    describe("scene", () => {
        it("should find and remove a given item condition", async () => {
            const scene = new Scene();

            // create 3 items and try to find them out-of-order
            const testItem1 = new Item({ x: 0, y: 0 });
            const testItem2 = new Item({ x: 1, y: 1 });
            const testItem3 = new Item({ x: 2, y: 2 });

            scene.add(testItem1);
            scene.add(testItem2);
            scene.add(testItem3);

            let testNum1FindResult = scene.find((n) => n === testItem1);
            let testNum3FindResult = scene.find((n) => n === testItem3);
            let testNum2FindResult = scene.find((n) => n === testItem2);

            expect(testNum1FindResult[0]).toEqual(testItem1);
            expect(testNum2FindResult[0]).toEqual(testItem2);
            expect(testNum3FindResult[0]).toEqual(testItem3);

            // now delete these numbers and see if we actually removed them
            scene.delete(testNum2FindResult[0]);
            testNum2FindResult = scene.find((n) => n === testItem2);
            expect(0 in testNum2FindResult).toBeFalsy();

            scene.delete(testNum3FindResult[0]);
            testNum3FindResult = scene.find((n) => n === testItem3);
            expect(0 in testNum3FindResult).toBeFalsy();

            scene.delete(testNum1FindResult[0]);
            testNum1FindResult = scene.find((n) => n === testItem1);
            expect(0 in testNum1FindResult).toBeFalsy();
        });

        it("should delete objects only if they're in the scene", async () => {
            const testContainer = new Scene();

            const testObject = new Item({ x: 123, y: 123 });
            testContainer.add(testObject);

            // a similar object, but not the same reference
            testContainer.delete(new Item());
            const case1 = testContainer.find(
                (object) => object.position.x === 123
            );
            expect(0 in case1).toBeTruthy();

            // should remove the test object now
            testContainer.delete(testObject);
            const case2 = testContainer.find(
                (object) => object.position.x === 123
            );
            expect(0 in case2).toBeFalsy();
        });
        it("should clear all contents in a scene", async () => {
            const scene = new Scene();

            // add some numbers, try to clear it all
            scene.add(new Item({ x: 1, y: 0 }));
            scene.add(new Item({ x: 2, y: 0 }));
            scene.add(new Item({ x: 3, y: 0 }));

            scene.clear();

            const testCase1 = scene.find((obj) => obj.position.x === 1);
            const testCase2 = scene.find((obj) => obj.position.x === 2);
            const testCase3 = scene.find((obj) => obj.position.x === 3);

            expect(0 in testCase1).toBeFalsy();
            expect(0 in testCase2).toBeFalsy();
            expect(0 in testCase3).toBeFalsy();
        });
    });

    describe("item", () => {
        it("can move given speed and direction", async () => {
            const item = new Item();

            item.move(angleToDirection(0), 1);
            expect(item.position.x).toBeCloseTo(1);
            expect(item.position.y).toBeCloseTo(0);
            item.move(angleToDirection(90), 1);
            expect(item.position.x).toBeCloseTo(1);
            expect(item.position.y).toBeCloseTo(-1);
            item.move(angleToDirection(180), 1);
            expect(item.position.x).toBeCloseTo(0);
            expect(item.position.y).toBeCloseTo(-1);
            item.move(angleToDirection(270), 1);
            expect(item.position.x).toBeCloseTo(0);
            expect(item.position.y).toBeCloseTo(0);
        });

        it("can loop its position around a given rectangle", async () => {
            const item = new Item(undefined, { width: 2, height: 1 });
            const limits = { top: -1, bottom: 3, right: 3, left: -2 };

            // should loop if it reaches the limit in the right direction
            item.position.x = 3;
            item.loop(limits, angleToDirection(0));
            expect(item.position.x).toBeCloseTo(-2);

            // shouldn't change position if the direction is opposite
            item.position.x = 3;
            item.loop(limits, angleToDirection(180));
            expect(item.position.x).toBeCloseTo(3);

            // now it should change its position considering this direction
            item.position.x = -2;
            item.loop(limits, angleToDirection(180));
            expect(item.position.x).toBeCloseTo(3);

            // now it should change its position vertically
            item.position.y = -1;
            item.loop(limits, angleToDirection(90));
            expect(item.position.y).toBeCloseTo(3);

            // now it shouldn't change its position given an opposing direction
            item.position.y = -1;
            item.loop(limits, angleToDirection(270));
            expect(item.position.y).toBeCloseTo(-1);

            // now following the opposing direction, it should change its position
            item.position.y = 3;
            item.loop(limits, angleToDirection(270));
            expect(item.position.y).toBeCloseTo(-1);
        });
    });

    describe("simulation", () => {
        it("should fill and layout a grid of items", async () => {
            const scene = new Scene();
            const sizes = new LiveSize({
                root: { width: 1188, height: 660 },
                item: { width: 396, height: 132 },
            });
            const attr = new LiveAttributes();
            const simulation = new Simulation(sizes, attr, scene);

            const resultScene = new Scene();
            const RESULT = [
                { position: { x: -396, y: -132 } },
                { position: { x: 0, y: -132 } },
                { position: { x: 396, y: -132 } },
                { position: { x: 792, y: -132 } },
                { position: { x: -396, y: 0 } },
                { position: { x: 0, y: 0 } },
                { position: { x: 396, y: 0 } },
                { position: { x: 792, y: 0 } },
                { position: { x: -396, y: 132 } },
                { position: { x: 0, y: 132 } },
                { position: { x: 396, y: 132 } },
                { position: { x: 792, y: 132 } },
                { position: { x: -396, y: 264 } },
                { position: { x: 0, y: 264 } },
                { position: { x: 396, y: 264 } },
                { position: { x: 792, y: 264 } },
                { position: { x: -396, y: 396 } },
                { position: { x: 0, y: 396 } },
                { position: { x: 396, y: 396 } },
                { position: { x: 792, y: 396 } },
                { position: { x: -396, y: 528 } },
                { position: { x: 0, y: 528 } },
                { position: { x: 396, y: 528 } },
                { position: { x: 792, y: 528 } },
            ];
            for (const resultPosObj of RESULT) {
                resultScene.add(new Item(resultPosObj.position, sizes.item));
            }

            simulation.fill();
            simulation.layout();

            // go through our expected grid layout and see if our testContainer
            // did generate a match
            for (const resultPosObj of resultScene.contents) {
                const matchedPosObj = scene.find((item) => {
                    return (
                        resultPosObj.position.x === item.position.x &&
                        resultPosObj.position.y === item.position.y
                    );
                });

                expect(matchedPosObj[0].position).toEqual(
                    resultPosObj.position
                );
            }
        });

        it("should update a simulation deterministically over time", async () => {
            // we create a repeating pattern over a small box
            const sizes = new LiveSize({
                root: allDirectionsSnapshot.setup.marqueeSize,
                item: allDirectionsSnapshot.setup.itemSize,
            });
            const attr = new LiveAttributes({ speed: 1, direction: 0 });
            const scene = new Scene();
            const simulation = new Simulation(sizes, attr, scene);

            // restart the system over 360 degrees
            for (let theta = 0; theta <= 360; theta++) {
                simulation.updateAttribute({ direction: theta });
                simulation.setup(); // start won't start if not stopped. have to start to stop...

                // keep track of each step of the animation updates
                const testMotionFrames = [];

                let t = 0;
                for (
                    let i = 0;
                    i < allDirectionsSnapshot.setup.numMotions;
                    i++
                ) {
                    const dt = i * allDirectionsSnapshot.setup.dt;
                    t += dt;
                    simulation.step(dt, t);
                }

                for (const item of scene.contents) {
                    testMotionFrames.push({
                        x: item.position.x.toFixed(2),
                        y: item.position.y.toFixed(2),
                    });
                }

                // keep things in a consistent order
                testMotionFrames.sort((a, b) => {
                    const xOrder = parseFloat(a.x) - parseFloat(b.x);
                    return xOrder;
                });

                // have to fix type errors
                const testData: {
                    [key: string]: { frames: { x: string; y: string }[] };
                } = allDirectionsSnapshot.data;
                expect(testMotionFrames).toEqual(
                    testData[theta.toString()].frames
                );
            }
        });

        it("should react to changes in size", async () => {
            const scene = new Scene();
            const sizes = new LiveSize({
                root: { width: 10, height: 10 },
                item: { width: 10, height: 10 },
            });
            const attr = new LiveAttributes({
                direction: 0,
                speed: 1,
            });
            const simulation = new Simulation(sizes, attr, scene);

            simulation.setup();

            // initial test
            expect(scene.length).toEqual(4);

            // update marquee
            sizes.update({ root: { width: 20, height: 20 } });
            simulation.updateSize(sizes);
            await browser.pause(300);
            expect(scene.length).toEqual(9);

            // return back
            sizes.update({ root: { width: 10, height: 10 } });
            simulation.updateSize(sizes);
            await browser.pause(300);
            expect(scene.length).toEqual(4);

            // update item
            sizes.update({ item: { width: 5, height: 5 } });
            simulation.updateSize(sizes);
            await browser.pause(300);
            expect(scene.length).toEqual(9);

            // update marquee on top of item
            sizes.update({ root: { width: 20, height: 20 } });
            simulation.updateSize(sizes);
            await browser.pause(300);
            expect(scene.length).toEqual(25);

            // return back to normal
            sizes.update({
                root: { width: 10, height: 10 },
                item: { width: 10, height: 10 },
            });
            simulation.updateSize(sizes);
            await browser.pause(300);
            expect(scene.length).toEqual(4);
        });

        describe("pipeline", () => {
            it("should change its layout provided a pipeline", async () => {
                const pipeline = new Pipeline();
                const sizes = new LiveSize({
                    root: { width: 1, height: 1 },
                    item: { width: 1, height: 1 },
                });
                const attr = new LiveAttributes();
                const scene = new Scene();
                const simulation = new Simulation(sizes, attr, scene, pipeline);

                const testCase = [
                    {
                        position: { x: -2, y: 0 },
                        size: { width: 2, height: 1 },
                    },
                    {
                        position: { x: -1, y: 0 },
                        size: { width: 1, height: 1 },
                    },
                    {
                        position: { x: -2, y: 1 },
                        size: { width: 2, height: 2 },
                    },
                    {
                        position: { x: -1, y: 1 },
                        size: { width: 1, height: 2 },
                    },
                ];

                pipeline.onLayout = ({ position, initialSize }) => {
                    position.x -= 1;
                    position.y += 1;

                    return {
                        position,
                        size: {
                            width:
                                position.x < -1
                                    ? initialSize.width + 1
                                    : initialSize.width,
                            height:
                                position.y > 0
                                    ? initialSize.height + 1
                                    : initialSize.height,
                        },
                    };
                };

                simulation.setup();

                Array.from(scene.contents).forEach((item, i) => {
                    expect(item.size).toEqual(testCase[i].size);
                    expect(item.position).toEqual(testCase[i].position);
                });
            });

            it("should change its direction provided a pipeline", async () => {
                const pipeline = new Pipeline();
                const sizes = new LiveSize({
                    root: { width: 1, height: 1 },
                    item: { width: 1, height: 1 },
                });
                const attr = new LiveAttributes();
                const scene = new Scene();
                const simulation = new Simulation(sizes, attr, scene, pipeline);

                const testCase = [
                    { position: { x: -1, y: -0.41256778644971204 } },
                    {
                        position: {
                            x: -0.29206200812364436,
                            y: -0.41256778644971204,
                        },
                    },
                    { position: { x: -1, y: 0.2937254077498802 } },
                    {
                        position: {
                            x: -0.29206200812364436,
                            y: 0.2937254077498802,
                        },
                    },
                ];

                pipeline.onMove = ({ direction, t }) => {
                    return { direction: Math.cos(t * 0.005) * 45 };
                };

                simulation.setup();
                for (let dt = 0.123, t = 0; t < 11; t += dt) {
                    simulation.step(dt, t);
                }

                Array.from(scene.contents).forEach((item, i) => {
                    expect(item.position.x).toBeCloseTo(testCase[i].position.x);
                    expect(item.position.y).toBeCloseTo(testCase[i].position.y);
                });
            });

            it("should override the limits", async () => {
                const pipeline = new Pipeline();
                const sizes = new LiveSize({
                    root: { width: 1, height: 1 },
                    item: { width: 1, height: 1 },
                });
                const attr = new LiveAttributes({ direction: 45 });
                const scene = new Scene();
                const simulation = new Simulation(sizes, attr, scene, pipeline);

                const testCase = [
                    {
                        position: {
                            x: -1.2928932188134525,
                            y: -0.8284271247461898,
                        },
                    },
                    {
                        position: {
                            x: 0.12132034355964261,
                            y: -0.8284271247461898,
                        },
                    },
                    {
                        position: {
                            x: -1.2928932188134525,
                            y: -0.12132034355964239,
                        },
                    },
                    {
                        position: {
                            x: 0.12132034355964261,
                            y: -0.12132034355964239,
                        },
                    },
                ];

                pipeline.onLoop = ({ limits }) => {
                    return {
                        limits: {
                            left: limits.left - 1,
                            right: limits.right + 1,
                            top: limits.top - 1,
                            bottom: limits.bottom + 1,
                        },
                    };
                };

                simulation.setup();
                for (let dt = 0.123, t = 0; t < 11; t += dt) {
                    simulation.step(dt, t);
                }

                Array.from(scene.contents).forEach((item, i) => {
                    expect(item.position).toEqual(testCase[i].position);
                });
            });
        });
    });
});
