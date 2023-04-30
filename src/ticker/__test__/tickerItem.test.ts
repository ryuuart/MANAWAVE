import Square from "@test/pages/square/Square";
import Basic from "@test/pages/basic/Basic";
import { Template } from "~src/clones";
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

    it("can create multiple items", async () => {
        Basic.loadContent();
        const amount = 10;

        const template = new Template(Basic.ticker.children);
        const tickerItems: TickerItem[] = [];

        for (let i = 0; i < amount; i++) {
            tickerItems.push(new TickerItem(template));
        }

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

    it("can set itself to a new position", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const tickerItem = new TickerItem(template);

        tickerItem.position = [1234, 1234];

        expect(tickerItem.position).toStrictEqual([1234, 1234]);
    });

    it("should be in a store if given a store", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const tickerItem = new TickerItem(template);
        const store = new TickerStore();

        tickerItem.registerStore(store);

        expect(store.get(tickerItem.id)).toBeTruthy();
    });

    it("should remove itself from a store if removed", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const tickerItem = new TickerItem(template);
        const store = new TickerStore();

        tickerItem.registerStore(store);
        tickerItem.remove();

        expect(store.get(tickerItem.id)).toBeFalsy();
    });
});
