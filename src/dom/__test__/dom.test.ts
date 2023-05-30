import Square from "test/pages/square/Square";
import { measure } from "../measure";

describe("dom", () => {
    beforeEach(() => {
        Square.loadContent();
    });
    afterEach(() => {
        Square.clearContent();
    });

    it("should measure a dom element if rendered", async () => {
        const testElement = Square.square;
        testElement.style.width = "120px";
        testElement.style.height = "130px";

        const rect = measure(testElement);

        const observedElement = await $(`#${testElement.id}`);
        const observedRect = await observedElement.getSize();

        expect(rect?.width).toEqual(120);
        expect(rect?.height).toEqual(130);

        expect(rect?.width).toEqual(observedRect.width);
        expect(rect?.height).toEqual(observedRect.height);

        testElement.remove();

        let disconnectedRect = measure(testElement);

        expect(disconnectedRect).toBe(null);

        Square.clearContent();

        let nullRect = measure(Square.square);

        expect(nullRect).toBe(null);
    });
});
