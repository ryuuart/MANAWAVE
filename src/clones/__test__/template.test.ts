import Basic from "test/pages/basic/Basic";
import { Template } from "../";

describe("template", () => {
    afterEach(() => {
        Basic.clearContent();
    });

    it("can restore template contents to original state", async () => {
        Basic.loadContent();

        const original = Basic.ticker.querySelectorAll("*");
        const template = new Template(Basic.ticker.children);

        // Should be empty
        expect(Basic.ticker.children.length).toBe(0);

        template.restore();

        // Everything should be back
        const restored = Basic.ticker.querySelectorAll("*");
        expect(restored.length).toBe(original.length);
        for (let i = 0; i < original.length; i++) {
            expect(restored[i]).toBe(original[i]);
        }
    });
});
