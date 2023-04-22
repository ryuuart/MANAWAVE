import Square from "@test/pages/square/Square";
import { Clone, Template } from "~src/clones";
import TickerItem from "../TickerItem";

describe("ticker item", () => {
    afterEach(() => {
        Square.clearContent();
    });

    it("can be created from a clone", () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const clone = new Clone(template);
        const tickerItem = new TickerItem(clone);

        expect(tickerItem.clone.element).toBeTruthy();
    });

    // it("can create multiple", () => {
    //     Square.loadContent();

    // });
});
