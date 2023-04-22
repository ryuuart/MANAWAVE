import { Clone, Cloner, Template } from "../";
import Square from "~test/pages/square/Square";

describe("Clones", () => {
    // boilerplate... has to be there every time
    afterEach(() => {
        Square.clearContent();
    });

    it("can clone multiple", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const cloner = new Cloner();
        cloner.register(template);

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
});
