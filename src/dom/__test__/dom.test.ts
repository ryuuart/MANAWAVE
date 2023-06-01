import Square from "test/pages/square/Square";
import { getRepetitions, measure } from "../measure";

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
});
