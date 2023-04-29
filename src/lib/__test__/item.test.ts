import { Template } from "~src/clones";
import Basic from "~test/pages/basic/Basic";
import Item from "../Item";

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

        expect(item.dimensions).toStrictEqual({ width: 0, height: 0 });

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
