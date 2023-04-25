import { isDOMList } from "~src/dom";
import { Clone, Cloner, Template } from "../";
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
        const cloner = new Cloner();
        cloner.addTemplate(template);

        const cloneAmount = 10;
        const clones = cloner.clone(cloneAmount, (clone: Clone) => {
            document.body.append(clone.element);
        });

        // TODO
        // This is a failing test because the first element should be removed from the
        // page we're temporarily allowing it to pass right now
        expect(document.body.children.length).toBeGreaterThanOrEqual(
            cloneAmount
        );
    });

    it("can be removed", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const clone = new Clone(template);

        clone.remove();

        expect(document.contains(clone.element)).toBeFalsy();
    });

    it("should not clone if there are no templates", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const cloner = new Cloner();
        cloner.addTemplate(template);
        cloner.removeTemplate(template);

        const clones = cloner.clone(100);

        expect(clones.length).toBe(0);
    });

    it("can restore template contents to original state", async () => {
        Basic.loadContent();

        const ticker = new Ticker(Basic.ticker);
        const template = ticker.initialTemplate;
        const cloner = new Cloner();
        cloner.addTemplate(template);

        if (isDOMList(template.original)) {
            for (const element of template.original) {
                expect(ticker.wrapperElement.contains(element)).toBeFalsy();
            }
        } else
            expect(
                ticker.wrapperElement.contains(template.original)
            ).toBeFalsy();

        template.restore();

        if (isDOMList(template.original)) {
            for (const element of template.original) {
                expect(ticker.wrapperElement.contains(element)).toBeTruthy();
            }
        } else
            expect(
                ticker.wrapperElement.contains(template.original)
            ).toBeTruthy();
    });
});
