import Square from "@test/pages/square/Square";
import Basic from "@test/pages/basic/Basic";
import { Clone, Cloner, Template } from "~src/clones";
import TickerItem from "../TickerItem";
import TickerItemFactory from "../TickerItemFactory";
import { TickerItemRegistry } from "~src/data";
import Ticker from "../Ticker";

describe("ticker item", () => {
    afterEach(() => {
        Square.clearContent();
        Basic.clearContent();
    });

    it("can be created from a clone", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const clone = new Clone(template);
        const tickerItem = new TickerItem(clone, 999);

        expect(tickerItem.clone.element).toBeTruthy();
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
        const registry = new TickerItemRegistry();
        const cloner = new Cloner();
        cloner.addTemplate(ticker.initialTemplate);

        // probably should adjust ticker to a container
        // increase cohesion by removing tight coupling between units
        const factory = new TickerItemFactory(registry, cloner, ticker);

        const tickerItems = factory.create(amount);
        const tickerItemsHTML = tickerItems.map((item: TickerItem) => {
            return item.clone.element;
        });
        const expectedTickerItemsHTML = Array.from(ticker.element.children);
        expect(tickerItems.length).toBe(expectedTickerItemsHTML.length);

        tickerItemsHTML.forEach((element: HTMLElement, index: number) => {
            expect(element).toBe(expectedTickerItemsHTML[index]);
        });
    });

    it("can remove a ticker item from the page", async () => {
        Square.loadContent();

        const template = new Template(Square.square);
        const tickerItem = new TickerItem(new Clone(template), 999);

        document.body.append(tickerItem.clone.element);

        tickerItem.remove();

        expect(document.contains(tickerItem.clone.element)).toBeFalsy();
    });
});
