import Square from "@test/pages/square/Square";
import { Clone, Template } from "~src/clones";
import { TickerStore } from "..";
import { TickerItem } from "~src/ticker";

describe("ticker item registry", () => {
    afterEach(() => {
        Square.clearContent();
    });

    it("should store given a clone", async () => {
        Square.loadContent();

        const store = new TickerStore();
        const template = new Template(Square.square);
        const clone = new Clone(template);
        const item = new TickerItem(clone);

        store.add(item);

        expect(store.isEmpty).toBeFalsy();
    });

    it("should retrieve an id given an HTML element", async () => {
        Square.loadContent();

        const expectedID = 999;
        Square.square.dataset.id = expectedID.toString();

        const store = new TickerStore();

        const id = store.getId(Square.square);

        expect(id).toBe(expectedID);
    });

    it("should retrieve a ticker item given an HTML element", async () => {
        Square.loadContent();

        const store = new TickerStore();
        const template = new Template(Square.square);
        const clone = new Clone(template);
        const item = new TickerItem(clone);

        const expectedTickerItem = store.add(item);

        const tickerItem = store.get(item.id);

        expect(tickerItem).toBe(expectedTickerItem);
    });

    it("should retrieve a ticker item given an ID number", async () => {
        Square.loadContent();

        const store = new TickerStore();
        const template = new Template(Square.square);
        const clone = new Clone(template);
        const item = new TickerItem(clone);

        const expectedTickerItem = store.add(item);

        const tickerItem = store.get(expectedTickerItem.id);

        expect(tickerItem).toBe(expectedTickerItem);
    });

    it("should remove a ticker item in the store given a ticker item", () => {
        Square.loadContent();

        const store = new TickerStore();
        const template = new Template(Square.square);
        const clone = new Clone(template);
        const item = new TickerItem(clone);

        const tickerItem = store.add(item);

        store.remove(tickerItem);

        expect(store.isEmpty).toBeTruthy();
    });
});
