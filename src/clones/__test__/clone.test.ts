import { isDOMList } from "~src/dom";
import { Clone, Template } from "../";
import Square from "~test/pages/square/Square";
import Basic from "@test/pages/basic/Basic";
import { Ticker } from "~src/ticker";

describe("Clones", () => {
    // boilerplate... has to be there every time
    afterEach(() => {
        Square.clearContent();
        Basic.clearContent();
    });

    it("can clone multiple", async () => {
        Square.loadContent();

        const template = new Template(Square.square);

        const cloneAmount = 10;
        const clones: Clone[] = [];

        for (let i = 0; i < cloneAmount; i++) {
            clones.push(new Clone(template));
        }

        expect(clones.length).toBe(cloneAmount);
    });

    it("can be removed", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const clone = new Clone(template);

        clone.remove();

        expect(clone.isRendered).toBeFalsy();
    });

    it("should not clone if there are no templates", async () => {
        Square.loadContent();

        const template = new Template(Square.square);

        const clones: Clone[] = [];
        for (let i = 0; i < 100; i++) {
            clones.push(new Clone(template));
        }

        expect(clones.length).toBe(0);
    });

    it("can restore template contents to original state", async () => {
        Basic.loadContent();

        const ticker = new Ticker(Basic.ticker);
        const template = ticker.initialTemplate!;

        // Ticker should be empty with the initial template
        if (isDOMList(template.original)) {
            for (const element of template.original) {
                expect(Basic.ticker.contains(element)).toBeFalsy();
            }
        } else expect(Basic.ticker.contains(template.original)).toBeFalsy();

        template.restore();

        // Everything should be back
        if (isDOMList(template.original)) {
            for (const element of template.original) {
                expect(Basic.ticker.contains(element)).toBeTruthy();
            }
        } else expect(Basic.ticker.contains(template.original)).toBeTruthy();
    });
});
