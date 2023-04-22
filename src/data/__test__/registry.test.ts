import Square from "@test/pages/square/Square";
import { Clone, Template } from "~src/clones";
import { TickerItemRegistry } from "..";

describe("ticker item registry", () => {
    afterEach(() => {
        Square.clearContent();
    });

    it("should register given a clone", async () => {
        Square.loadContent();

        const registry = new TickerItemRegistry();
        const template = new Template(Square.square);
        const clone = new Clone(template);

        registry.register(clone);

        expect(registry.tickerElements.size).toBeGreaterThan(0);
    });

    it("should retrieve an id given an HTML element", async () => {
        Square.loadContent();

        const expectedID = 999;
        Square.square.dataset.id = expectedID.toString();

        const registry = new TickerItemRegistry();

        const id = registry.getId(Square.square);

        expect(id).toBe(expectedID);
    });

    it("should retrieve a ticker item given an HTML element", async () => {
        Square.loadContent();

        const registry = new TickerItemRegistry();
        const template = new Template(Square.square);
        const clone = new Clone(template);

        const expectedTickerItem = registry.register(clone);

        // have to use cloneElement because Square isn't on the page
        // anymore after using Template
        const tickerItem = registry.get(clone.element);

        expect(tickerItem).toBe(expectedTickerItem);
    });

    it("should retrieve a ticker item given an ID number", async () => {
        Square.loadContent();

        const registry = new TickerItemRegistry();
        const template = new Template(Square.square);
        const clone = new Clone(template);

        const expectedTickerItem = registry.register(clone);

        const tickerItem = registry.get(expectedTickerItem.id);

        expect(tickerItem).toBe(expectedTickerItem);
    });
});
