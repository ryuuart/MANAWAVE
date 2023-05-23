import Lifecycle from "@billboard/lib/Lifecycle";
import { Template } from "src/clones";
import Basic from "test/pages/basic/Basic";
import Item from "../Item";
import Square from "test/pages/square/Square";

describe("item", () => {
    afterEach(() => {
        Basic.clearContent();
    });

    it("should contain a clone", async () => {
        Basic.loadContent();

        const template = new Template(Basic.ticker.children);
        const item = new Item(template);

        item.appendTo(document.body);

        expect(item.isRendered).toBeTruthy();
    });

    it("should have dimensions", async () => {
        Basic.loadContent();

        const template = new Template(Basic.ticker.children);
        const item = new Item(template);

        item.appendTo(document.body);

        expect(item.dimensions.width).toBeGreaterThan(0);
        expect(item.dimensions.height).toBeGreaterThan(0);
    });

    it("should have unique ids", async () => {
        Basic.loadContent();

        const template = new Template(Basic.ticker.children);
        const items1: Item[] = [];
        const items2: Item[] = [];

        const SPECIFICITY = 100;

        for (let i = 0; i < SPECIFICITY; i++) items1.push(new Item(template));
        for (let i = 0; i < SPECIFICITY; i++) items2.push(new Item(template));
        for (let i = 0; i < SPECIFICITY; i++)
            expect(items1[i].id).not.toBe(items2[i].id);
    });
});

describe("lifecycle", async () => {
    beforeEach(async () => {
        Square.loadContent();
    });
    afterEach(async () => {
        Square.clearContent();
    });

    it("set and use onCreated", async () => {
        const lifecycle = new Lifecycle();

        expect(Square.square.textContent).not.toEqual("CREATED");

        lifecycle.onCreated = (element: Element) => {
            element.textContent = "CREATED";
        };

        lifecycle.onCreated(Square.square);

        expect(Square.square.textContent).toEqual("CREATED");
    });

    it("set and use onDestroyed", async () => {
        const lifecycle = new Lifecycle();

        expect(Square.square.textContent).not.toEqual("DESTROYED");

        lifecycle.onDestroyed = (element: Element) => {
            element.textContent = "DESTROYED";
        };

        lifecycle.onDestroyed(Square.square);

        expect(Square.square.textContent).toEqual("DESTROYED");
    });

    it("set and use each", async () => {
        const lifecycle = new Lifecycle();

        expect(Square.square.textContent).not.toEqual("EACH");

        lifecycle.each = (element: Element) => {
            element.textContent = "EACH";
        };

        lifecycle.each(Square.square);

        expect(Square.square.textContent).toEqual("EACH");
    });
});
