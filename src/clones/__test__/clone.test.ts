import Basic from "@test/pages/basic/Basic";
import Square from "@test/pages/square/Square";
import { Clone, Template } from "../";

describe("clone", () => {
    // boilerplate... has to be there every time
    afterEach(() => {
        Square.clearContent();
        Basic.clearContent();
    });

    it("should wrap an element with clone classes and divs", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const clone = new Clone(template);
        clone.appendTo(document.body);

        const element = document.querySelector(".billboard-clone");
        expect(element).toBeTruthy();
    });

    it("should update its position given a new position", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const clone = new Clone(template);
        clone.setPosition([1234, 1234]);

        expect(clone.transformStyle).toBe("translate(1234px, 1234px)");
    });

    it("should maintain state of its id given a new one", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const clone = new Clone(template);

        clone.id = 999;

        expect(clone.id).toBe(999);
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
});
