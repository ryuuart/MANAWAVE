import Basic from "test/pages/basic/Basic";
import { Container, clearContainer } from "../container";
import { layoutGrid } from "../layout";
import TickerSystem from "../system";
import { TickerState } from "../state";

import allDirectionsSnapshot from "./data/all_direction.json";
import { simulateItem } from "../simulation";
import { Item } from "../item";

describe("ticker", () => {
    describe("container", () => {
        afterEach(() => {
            Basic.clearContent();
        });
        it("should find and remove a given item condition", async () => {
            const container = new Container<number>();

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
            const testContainer = new Container<{ n: number }>();

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
            const container = new Container<{ n: number }>();

            // add some numbers, try to clear it all
            container.add({ n: 1 });
            container.add({ n: 2 });
            container.add({ n: 3 });

            clearContainer(container);

            const testCase1 = container.find((obj) => obj.n === 1);
            const testCase2 = container.find((obj) => obj.n === 1);
            const testCase3 = container.find((obj) => obj.n === 1);

            expect(0 in testCase1).toBeFalsy();
            expect(0 in testCase2).toBeFalsy();
            expect(0 in testCase3).toBeFalsy();
        });
    });

    describe("layout", () => {
        afterEach(() => {
            Basic.clearContent();
        });

        it("should layout a grid of items", async () => {
            const testItemSize = { width: 123, height: 123 };
            const testContainerSize = { width: 300, height: 300 };
            const testContainer = new Container<Positionable>();

            const resultContainer = new Container<Positionable>();
            const RESULT = [
                { position: { x: 0, y: 0 } },
                {
                    position: {
                        x: 123,
                        y: 0,
                    },
                },
                {
                    position: {
                        x: 246,
                        y: 0,
                    },
                },
                {
                    position: {
                        x: 0,
                        y: 123,
                    },
                },
                {
                    position: {
                        x: 123,
                        y: 123,
                    },
                },
                {
                    position: {
                        x: 246,
                        y: 123,
                    },
                },
                {
                    position: {
                        x: 0,
                        y: 246,
                    },
                },
                {
                    position: {
                        x: 123,
                        y: 246,
                    },
                },
                {
                    position: {
                        x: 246,
                        y: 246,
                    },
                },
            ];
            for (const resultPosObj of RESULT) {
                resultContainer.add(resultPosObj);
            }

            // simulate creation of grid
            for (let i = 0; i < 9; i++) {
                testContainer.add({
                    position: {
                        x: 0,
                        y: 0,
                    },
                });
            }

            layoutGrid(testContainer, {
                grid: {
                    size: {
                        width: testContainerSize.width,
                        height: testContainerSize.height,
                    },
                },
                item: {
                    size: {
                        width: testItemSize.width,
                        height: testItemSize.height,
                    },
                },
                repetitions: {
                    horizontal: 3,
                    vertical: 3,
                },
            });

            // go through our expected grid layout and see if our testContainer
            // did generate a match
            for (const resultPosObj of resultContainer.contents) {
                const matchedPosObj = testContainer.find((rect) => {
                    return (
                        resultPosObj.position.x === rect.position.x &&
                        resultPosObj.position.y === rect.position.y
                    );
                });

                expect(matchedPosObj[0]).toEqual(resultPosObj);
            }
        });
    });

    describe("system", () => {
        it("should update a system deterministically over time", async () => {
            // we create a repeating pattern over a small box
            const state = new TickerState({
                ticker: {
                    size: allDirectionsSnapshot.setup.tickerSize,
                },
                item: { size: allDirectionsSnapshot.setup.itemSize },
            });

            const system = new TickerSystem(state.current);

            // restart the system over 360 degrees
            for (let theta = 0; theta <= 360; theta++) {
                state.update({ direction: theta });
                state.notify("update", [system]);

                system.start();

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

                for (const item of system.container.contents) {
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

                system.stop();

                // have to fix type errors
                const testData: {
                    [key: string]: { frames: { x: string; y: string }[] };
                } = allDirectionsSnapshot.data;
                expect(testMotionFrames).toEqual(
                    testData[theta.toString()].frames
                );
            }
        });

        it("should respect the autoplay option", async () => {
            const state = new TickerState({
                ticker: { size: { width: 10, height: 10 } },
                item: { size: { width: 10, height: 10 } },
                autoplay: false,
            });
            let currentContents = [];

            // it didn't start if there's nothing in it
            let system = new TickerSystem(state.current);

            currentContents = [];
            for (const item of system.container.contents) {
                currentContents.push(item);
            }

            expect(currentContents.length).toEqual(0);

            // so say it starts, it should have stuff in it
            state.update({ autoplay: true });
            system = new TickerSystem(state.current);

            currentContents = [];
            for (const item of system.container.contents) {
                currentContents.push(item);
            }

            expect(currentContents.length).toBeGreaterThan(0);
        });

        it("should react to changes in state", async () => {
            const state = new TickerState({
                ticker: { size: { width: 10, height: 10 } },
                item: { size: { width: 10, height: 10 } },
            });

            const system = new TickerSystem(state.current);

            // need to fix this with autoplay
            system.start();
            expect(system.container.size).toEqual(9);

            state.update({ ticker: { size: { width: 20, height: 20 } } });
            state.notify("update", [system]);
            expect(system.container.size).toEqual(16);

            system.stop();
            state.update({ ticker: { size: { width: 10, height: 10 } } });
            state.notify("update", [system]);
            expect(system.container.size).toEqual(9);
        });
    });

    describe("simulation", () => {
        it("can override intended simulation motion in a callback", async () => {
            const item = new Item();
            const tState = new TickerState({
                ticker: { size: { width: 10, height: 10 } },
                item: { size: { width: 1, height: 1 } },
                direction: 0,
            });
            const simulationData = {
                t: 0,
                dt: 0,
                tState: tState.current,
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
