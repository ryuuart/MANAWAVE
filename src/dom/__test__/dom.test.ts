import Square from "test/pages/square/Square";
import { getRepetitions, measure } from "../measure";
import {
    convertDirection,
    fromTAttributes,
    generateTOptions,
} from "../attributes";

describe("dom", () => {
    beforeEach(() => {
        Square.loadContent();
    });
    afterEach(() => {
        Square.clearContent();
    });

    it("should measure a dom element if rendered", async () => {
        const testElement = Square.square!;
        testElement.style.width = "120px";
        testElement.style.height = "130px";

        // our change in measurement should be observed
        const rect = measure(testElement);

        const observedElement = await $(`#${testElement.id}`);
        const observedRect = await observedElement.getSize();

        expect(rect?.width).toEqual(120);
        expect(rect?.height).toEqual(130);

        expect(rect?.width).toEqual(observedRect.width);
        expect(rect?.height).toEqual(observedRect.height);

        // if the element is removed or disconnected from the page,
        // there is no returned measurement
        testElement.remove();

        let disconnectedRect = measure(testElement);

        expect(disconnectedRect).toBe(null);
    });

    it("should calculate repetitions in different size contexts", async () => {
        const uniformRectLarge = { width: 1000, height: 1000 };
        const uniformRectSmall = { width: 100, height: 100 };
        const nonUniformRectSmall = { width: 123, height: 123 };

        // base uniform case where things fit in perfectly
        const case1 = getRepetitions(uniformRectLarge, uniformRectSmall);
        expect(case1).toEqual({ horizontal: 10, vertical: 10 });

        // a repeatable larger than its container should "repeat" 1 time
        const case2 = getRepetitions(uniformRectSmall, uniformRectLarge);
        expect(case2).toEqual({ horizontal: 1, vertical: 1 });

        // if they're the same length, it should "repeat" once
        const case3 = getRepetitions(uniformRectSmall, uniformRectSmall);
        expect(case3).toEqual({ horizontal: 1, vertical: 1 });

        // an uneven, smaller repeatable should round up to fill the space
        const case4 = getRepetitions(uniformRectLarge, nonUniformRectSmall);
        expect(case4).toEqual({ horizontal: 9, vertical: 9 });
    });

    describe("attribute", () => {
        it("convert strings to angle degrees", async () => {
            const direction1 = "up";
            expect(convertDirection(direction1)).toEqual(90);

            const direction2 = "right";
            expect(convertDirection(direction2)).toEqual(0);

            const direction3 = "down";
            expect(convertDirection(direction3)).toEqual(270);

            const direction4 = "left";
            expect(convertDirection(direction4)).toEqual(180);

            const direction5 = "123456";
            expect(convertDirection(direction5)).toEqual(123456);

            const direction6 = "potato";
            expect(convertDirection(direction6)).toEqual(0);
        });

        it("should extract ticker options from html element atttributes", async () => {
            const element = Square.square;
            element?.setAttribute("speed", "123");
            element?.setAttribute("direction", "up");
            element?.setAttribute("autoplay", "");

            expect(fromTAttributes(element!)).toEqual({
                speed: 123,
                direction: 90,
                autoplay: true,
            });
        });

        it("should generate Ticker parameters for the system given elements and overriding options", async () => {
            const element = Square.square;
            element?.setAttribute("speed", "123");
            element?.setAttribute("direction", "down");

            expect(generateTOptions(element!, { speed: 500 })).toEqual({
                speed: 500,
                direction: 270,
            });

            expect(generateTOptions(element!, { direction: 123 })).toEqual({
                speed: 123,
                direction: 123,
            });
        });
    });
});
