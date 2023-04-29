import Square from "@test/pages/square/Square";
import { Template } from "~src/clones";
import { TickerStore } from "..";
import { TickerItem } from "~src/ticker";

describe("store", () => {
    afterEach(() => {
        Square.clearContent();
    });

    it("should store given a TickerItem", async () => {
        Square.loadContent();

        const store = new TickerStore();
        const template = new Template(Square.square);
        const item = new TickerItem(template);

        store.add(item);

        expect(store.isEmpty).toBeFalsy();
    });

    it("should retrieve an id given an HTML element", async () => {
        Square.loadContent();

        const expectedID = 999;
        Square.square.dataset.id = expectedID.toString();

        const store = new TickerStore();

        const id = store.getId(Square.square);

        expect(id).toStrictEqual(expectedID);
    });

    it("should retrieve a ticker item given an HTML element", async () => {
        Square.loadContent();

        const store = new TickerStore();
        const template = new Template(Square.square);
        const item = new TickerItem(template);

        const expectedTickerItem = store.add(item);

        const tickerItem = store.get(item.id);

        expect(tickerItem).toBe(expectedTickerItem);
    });

    it("should retrieve a ticker item given an ID number", async () => {
        Square.loadContent();

        const store = new TickerStore();
        const template = new Template(Square.square);
        const item = new TickerItem(template);

        const expectedTickerItem = store.add(item);

        const tickerItem = store.get(expectedTickerItem.id);

        expect(tickerItem).toBe(expectedTickerItem);
    });

    it("should remove a ticker item in the store given a ticker item", async () => {
        Square.loadContent();

        const store = new TickerStore();
        const template = new Template(Square.square);
        const item = new TickerItem(template);

        const tickerItem = store.add(item);

        store.remove(tickerItem);

        expect(store.isEmpty).toBeTruthy();
    });

    it("should remove a ticker item in the store given an id number", async () => {
        Square.loadContent();

        const store = new TickerStore();
        const template = new Template(Square.square);
        const item = new TickerItem(template);

        const tickerItem = store.add(item);

        store.remove(tickerItem.id);

        expect(store.isEmpty).toBeTruthy();
    });

    it("should remove a ticker item in the store given an element", async () => {
        Square.loadContent();

        const store = new TickerStore();
        const template = new Template(Square.square);
        const item = new TickerItem(template);

        store.add(item);

        item.appendTo(document.body);
        const element = document.querySelector(".billboard-clone");

        store.remove(element!);

        expect(store.isEmpty).toBeTruthy();
    });
});
