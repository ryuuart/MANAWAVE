import Basic from "test/pages/basic/Basic";
import { Container, clearContainer } from "../container";
import { layoutGrid } from "../layout";
import TickerSystem from "../system";
import { TickerState } from "../state";

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
            const state = new TickerState({
                ticker: {
                    size: {
                        width: 10,
                        height: 10,
                    },
                },
                item: {
                    size: {
                        width: 10,
                        height: 10,
                    },
                },
                direction: 123,
            });
            // we create a repeating pattern over a small box
            // the direction is at some random diagonal

            const system = new TickerSystem(state);

            system.start();

            // after 50 simulated milliseconds
            let t = 0;
            for (let i = 0; i < 5; i++) {
                const dt = i * 10;
                t += dt;
                system.update(dt, t);
            }

            // this is what it should be
            const MAIN_CASE = [
                { x: "-2.7", y: "-5.8" },
                { x: "-2.7", y: "4.2" },
                { x: "-2.7", y: "-6.6" },
                { x: "7.3", y: "-5.8" },
                { x: "7.3", y: "4.2" },
                { x: "7.3", y: "-6.6" },
                { x: "7.8", y: "-5.8" },
                { x: "7.8", y: "4.2" },
                { x: "7.8", y: "-6.6" },
            ];

            const testResult = [];
            for (const item of system.container.contents) {
                testResult.push({
                    x: item.position.x.toFixed(1),
                    y: item.position.y.toFixed(1),
                });
            }

            // must be sorted for consistency
            // it's sorted by x position
            testResult.sort((a, b) => {
                const xOrder = parseFloat(a.x) - parseFloat(b.x);
                return xOrder;
            });

            expect(testResult).toEqual(MAIN_CASE);
        });

        it("should respect the autoplay option", async () => {
            const state = new TickerState({
                ticker: { size: { width: 10, height: 10 } },
                item: { size: { width: 10, height: 10 } },
                autoplay: false,
            });
            let currentContents = [];

            // it didn't start if there's nothing in it
            let system = new TickerSystem(state);

            currentContents = [];
            for (const item of system.container.contents) {
                currentContents.push(item);
            }

            expect(currentContents.length).toEqual(0);

            // so say it starts, it should have stuff in it
            state.update({ autoplay: true });
            system = new TickerSystem(state);

            currentContents = [];
            for (const item of system.container.contents) {
                currentContents.push(item);
            }

            expect(currentContents.length).toBeGreaterThan(0);
        });
    });
});
