import Basic from "test/pages/basic/Basic";
import { Container } from "../container";
import { layoutGrid } from "../layout";

describe("ticker", () => {
    describe("container", () => {
        afterEach(() => {
            Basic.clearContent();
        });
        it("should find and remove a given item condition", async () => {
            const container = new Container<number>(0, 0);

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
            const testContainer = new Container<{ n: number }>(0, 0);

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
    });

    describe("layout", () => {
        afterEach(() => {
            Basic.clearContent();
        });

        it("should layout a grid of items", async () => {
            const testContainer = new Container<Rect & Positionable>(300, 300);
            const testItemSize = { width: 123, height: 123 };

            const resultContainer = new Container<Rect & Positionable>(
                300,
                300
            );
            const RESULT = [
                { width: 123, height: 123, x: 0, y: 0 },
                {
                    width: 123,
                    height: 123,
                    x: 123,
                    y: 0,
                },
                {
                    width: 123,
                    height: 123,
                    x: 246,
                    y: 0,
                },
                {
                    width: 123,
                    height: 123,
                    x: 0,
                    y: 123,
                },
                {
                    width: 123,
                    height: 123,
                    x: 123,
                    y: 123,
                },
                {
                    width: 123,
                    height: 123,
                    x: 246,
                    y: 123,
                },
                {
                    width: 123,
                    height: 123,
                    x: 0,
                    y: 246,
                },
                {
                    width: 123,
                    height: 123,
                    x: 123,
                    y: 246,
                },
                {
                    width: 123,
                    height: 123,
                    x: 246,
                    y: 246,
                },
            ];
            for (const resultRect of RESULT) {
                resultContainer.add(resultRect);
            }

            // simulate creation of grid
            for (let i = 0; i < 9; i++) {
                testContainer.add({
                    width: testItemSize.width,
                    height: testItemSize.height,
                    x: 0,
                    y: 0,
                });
            }

            layoutGrid(testContainer, { horizontal: 3, vertical: 3 });

            // go through our expected grid layout and see if our testContainer
            // did generate a match
            for (const resultRect of resultContainer.contents) {
                const matchedRect = testContainer.find((rect) => {
                    return (
                        resultRect.height === rect.height &&
                        resultRect.width === rect.width &&
                        resultRect.x === rect.x &&
                        resultRect.y === rect.y
                    );
                });

                expect(matchedRect[0]).toEqual(resultRect);
            }
        });
    });
});
