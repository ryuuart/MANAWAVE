import Square from "@test/pages/square/Square";
import Basic from "@test/pages/basic/Basic";
import { Clone, Template } from "~src/clones";
import TickerItem from "../TickerItem";
import TickerItemFactory from "../TickerItemFactory";
import { TickerStore } from "~src/data";
import Ticker from "../Ticker";

describe("ticker item", () => {
    afterEach(() => {
        Square.clearContent();
        Basic.clearContent();
    });

    it("should be created given a template", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const tickerItem = new TickerItem(template);

        expect(tickerItem).toBeTruthy();
    });

    // Not ready for test yet, need to do a dynamic
    // addition of a new TickerItem to the Ticker first
    // it("can create a sequence of items", async () => {
    //     Basic.loadContent();

    //     const ticker = new Ticker(Basic.ticker);
    //     const registry = new TickerItemRegistry();
    //     const cloner = new Cloner();

    //     const factory = new TickerItemFactory(registry, cloner, ticker);

    //     const tickerItem = factory;
    // });

    it("can create multiple items", async () => {
        Basic.loadContent();
        const amount = 10;

        const ticker = new Ticker(Basic.ticker);
        const registry = new TickerStore();
        const factory = new TickerItemFactory(registry, ticker);

        const tickerItems = factory.create(amount);

        expect(tickerItems.length).toBeGreaterThan(0);
    });

    it("can remove a ticker item from the page", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const tickerItem = new TickerItem(template);

        tickerItem.appendTo(document.body);

        tickerItem.remove();

        expect(tickerItem.isRendered).toBeFalsy();
    });
});
