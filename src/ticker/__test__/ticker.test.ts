import Basic from "test/pages/basic/Basic";
import { Scene, clearScene } from "../scene";
import TickerSystem from "../system";

import allDirectionsSnapshot from "./data/all_direction.json";
import { Simulation, simulateItem } from "../simulation";
import { Item } from "../item";
import { LiveAttributes, LiveSize } from "../context";

describe("ticker", () => {
    describe("scene", () => {
        afterEach(() => {
            Basic.clearContent();
        });
        it("should find and remove a given item condition", async () => {
            const container = new Scene<number>();

            // create 3 numbers and try to find them out-of-order
            const testNum1 = 123;
            const testNum2 = 456;
            const testNum3 = 789;

            container.add(testNum1);
            container.add(testNum2);
            container.add(testNum3);

            let testNum1FindResult = container.find((n) => n === testNum1);
            let testNum3FindResult = container.find((n) => n === testNum3);
            let testNum2FindResult = container.find((n) => n === testNum2);

            expect(testNum1FindResult[0]).toEqual(testNum1);
            expect(testNum2FindResult[0]).toEqual(testNum2);
            expect(testNum3FindResult[0]).toEqual(testNum3);

            // now delete these numbers and see if we actually removed them
            container.delete(testNum2FindResult[0]);
            testNum2FindResult = container.find((n) => n === testNum2);
            expect(0 in testNum2FindResult).toBeFalsy();

            container.delete(testNum3FindResult[0]);
            testNum3FindResult = container.find((n) => n === testNum3);
            expect(0 in testNum3FindResult).toBeFalsy();

            container.delete(testNum1FindResult[0]);
            testNum1FindResult = container.find((n) => n === testNum1);
            expect(0 in testNum1FindResult).toBeFalsy();
        });
        it("should delete objects only if they're in the container", async () => {
            const testContainer = new Scene<{ n: number }>();

            const testObject = { n: 123 };
            testContainer.add(testObject);

            // a similar object, but not the same reference
            testContainer.delete({ n: 123 });
            const case1 = testContainer.find((object) => object.n === 123);
            expect(0 in case1).toBeTruthy();

            // should remove the test object now
            testContainer.delete(testObject);
            const case2 = testContainer.find((object) => object.n === 123);
            expect(0 in case2).toBeFalsy();
        });
        it("should clear all contents in a container", async () => {
            const container = new Scene<{ n: number }>();

            // add some numbers, try to clear it all
            container.add({ n: 1 });
            container.add({ n: 2 });
            container.add({ n: 3 });

            clearScene(container);

            const testCase1 = container.find((obj) => obj.n === 1);
            const testCase2 = container.find((obj) => obj.n === 1);
            const testCase3 = container.find((obj) => obj.n === 1);

            expect(0 in testCase1).toBeFalsy();
            expect(0 in testCase2).toBeFalsy();
            expect(0 in testCase3).toBeFalsy();
        });
    });

    describe("simulation", () => {
        afterEach(() => {
            Basic.clearContent();
        });
        it("should fill and layout a grid of items", async () => {
            Basic.loadContent();

            const scene = new Scene<Item>();
            const sizes = new LiveSize({
                root: { width: 1188, height: 660 },
                item: { width: 396, height: 132 },
            });
            const attr = new LiveAttributes();
            const simulation = new Simulation(sizes, attr, scene);

            const resultScene = new Scene<Positionable>();
            const RESULT = [
                { position: { x: -396, y: -132 } },
                { position: { x: 0, y: -132 } },
                { position: { x: 396, y: -132 } },
                { position: { x: 792, y: -132 } },
                { position: { x: 1188, y: -132 } },
                { position: { x: -396, y: 0 } },
                { position: { x: 0, y: 0 } },
                { position: { x: 396, y: 0 } },
                { position: { x: 792, y: 0 } },
                { position: { x: 1188, y: 0 } },
                { position: { x: -396, y: 132 } },
                { position: { x: 0, y: 132 } },
                { position: { x: 396, y: 132 } },
                { position: { x: 792, y: 132 } },
                { position: { x: 1188, y: 132 } },
                { position: { x: -396, y: 264 } },
                { position: { x: 0, y: 264 } },
                { position: { x: 396, y: 264 } },
                { position: { x: 792, y: 264 } },
                { position: { x: 1188, y: 264 } },
                { position: { x: -396, y: 396 } },
                { position: { x: 0, y: 396 } },
                { position: { x: 396, y: 396 } },
                { position: { x: 792, y: 396 } },
                { position: { x: 1188, y: 396 } },
                { position: { x: -396, y: 528 } },
                { position: { x: 0, y: 528 } },
                { position: { x: 396, y: 528 } },
                { position: { x: 792, y: 528 } },
                { position: { x: 1188, y: 528 } },
                { position: { x: -396, y: 660 } },
                { position: { x: 0, y: 660 } },
                { position: { x: 396, y: 660 } },
                { position: { x: 792, y: 660 } },
                { position: { x: 1188, y: 660 } },
            ];
            for (const resultPosObj of RESULT) {
                resultScene.add(resultPosObj);
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

                expect({ position: matchedPosObj[0].position }).toEqual(
                    resultPosObj
                );
            }
        });
    });

    describe("system", () => {
        it("should update a system deterministically over time", async () => {
            // we create a repeating pattern over a small box
            const tSizes = {
                ticker: allDirectionsSnapshot.setup.tickerSize,
                item: allDirectionsSnapshot.setup.itemSize,
            };
            const tAttr = {
                speed: 1,
                direction: 0,
            };

            const system = new TickerSystem({
                sizes: tSizes,
                attributes: tAttr,
                dom: {
                    root: document.createElement("div"),
                    template: document.createDocumentFragment(),
                },
            });

            // restart the system over 360 degrees
            for (let theta = 0; theta <= 360; theta++) {
                system.updateAttributes({ direction: theta });
                system.start(); // start won't start if not stopped. have to start to stop...

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
                    system.update(dt, t);
                }

                for (const item of system.scene.contents) {
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

                system.stop(); // resets position

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
            const tSizes = {
                ticker: { width: 10, height: 10 },
                item: { width: 10, height: 10 },
            };

            const tProps = {
                direction: 0,
                speed: 1,
            };

            const system = new TickerSystem({
                sizes: tSizes,
                attributes: tProps,
                dom: {
                    root: document.createElement("div"),
                    template: new DocumentFragment(),
                },
            });

            system.start();
            // initial test
            expect(system.scene.length).toEqual(9);

            // update ticker
            tSizes.ticker = { width: 20, height: 20 };
            system.updateSize(tSizes);
            expect(system.scene.length).toEqual(16);

            // return back
            tSizes.ticker = { width: 10, height: 10 };
            system.updateSize(tSizes);
            expect(system.scene.length).toEqual(9);

            // update item
            tSizes.item = { width: 5, height: 5 };
            system.updateSize(tSizes);
            expect(system.scene.length).toEqual(16);

            // update ticker on top of item
            tSizes.ticker = { width: 20, height: 20 };
            system.updateSize(tSizes);
            expect(system.scene.length).toEqual(36);

            // return back to normal
            tSizes.ticker = { width: 10, height: 10 };
            tSizes.item = { width: 10, height: 10 };
            system.updateSize(tSizes);
            expect(system.scene.length).toEqual(9);
        });
    });

    describe("simulation", () => {
        it("can override intended simulation motion in a callback", async () => {
            const item = new Item();
            const simulationData = {
                sizes: {
                    ticker: { width: 10, height: 10 },
                    item: { width: 1, height: 1 },
                },
                direction: 0,
                speed: 1,
                t: 0,
                dt: 0,
            };

            simulateItem(item, simulationData);

            expect(item.position).toEqual({ x: 1, y: 0 });

            // test using all values to override the start position, x direction, and speed
            const overrideCallback: Parameters<typeof simulateItem>["2"] = ({
                sizes,
                item,
                direction,
                speed,
            }) => {
                item.position.x += Math.ceil(
                    (sizes.ticker.width + sizes.item.width) / 2
                );
                item.position.y += Math.ceil(
                    (sizes.ticker.height + sizes.item.height) / 2
                );
                direction.x = Math.cos(Math.PI);
                direction.y = Math.sin(Math.PI);
                speed.value = 2;
            };

            simulateItem(item, simulationData, overrideCallback);

            expect(item.position).toEqual({ x: 5, y: 6 });

            // simulate alterations in the y-direction
            simulateItem(item, simulationData, ({ direction, item }) => {
                item.position.y += 2;
                direction.x = Math.cos((3 * Math.PI) / 2);
                direction.y = Math.sin((3 * Math.PI) / 2);
            });

            expect(item.position).toEqual({ x: 5, y: 7 });
        });
    });
});
