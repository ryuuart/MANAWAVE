import TickerArtist from "@billboard/lib/TickerArtist";
import Basic from "test/pages/basic/Basic";
import Square from "test/pages/square/Square";
import { Template } from "src/clones";
import { TickerStore } from "src/data";
import TickerItem from "../TickerItem";
import Lifecycle from "@billboard/lib/Lifecycle";

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

    describe("artist", () => {
        it("should update position given a clone and position", async () => {
            Square.loadContent();

            const template = new Template(Square.square);
            const item = new TickerItem(template);

            // item has to exist on the page to do anything
            item.appendTo(document.getElementById("test-root")!);

            const artist = new TickerArtist(item);
            item.prepareArtist(artist);

            // do a render / draw operation
            artist.drawToPosition([123, 123]);

            // observe changes
            const element = await $(Square.square);
            expect(element).toHaveStyle({
                transform: `matrix(1, 0, 0, 1, ${123}, ${123})`,
            });
        });
    });

    describe("lifecycle", () => {
        it("should set and use all lifecycle functions", async () => {
            Square.loadContent();
            const lifecycle = new Lifecycle();

            lifecycle.onCreated = (element: HTMLElement) => {
                element.textContent = "TICKERITEM CREATED";
            };
            lifecycle.onDestroyed = (element: HTMLElement) => {
                element.textContent = "TICKERITEM DESTROYED";
            };
            lifecycle.each = (element: HTMLElement) => {
                element.textContent = "TICKERITEM ITERATED";
            };

            expect(await $(`#${Square.square.id}`).getHTML(false)).not.toEqual(
                "TICKERITEM CREATED"
            );

            const template = new Template(Square.square);
            const ti = new TickerItem(template, lifecycle);

            ti.appendTo(document.getElementById("test-root")!);

            expect(await $(`#${Square.square.id}`).getHTML(false)).toEqual(
                "TICKERITEM CREATED"
            );

            ti.each();

            ti.appendTo(document.getElementById("test-root")!);
            expect(await $(`#${Square.square.id}`).getHTML(false)).toEqual(
                "TICKERITEM ITERATED"
            );

            ti.remove();

            ti.appendTo(document.getElementById("test-root")!);
            expect(await $(`#${Square.square.id}`).getHTML(false)).toEqual(
                "TICKERITEM DESTROYED"
            );
        });

        it("should set and use all lifecycle on multiple elements", async () => {
            Basic.loadContent();
            const lifecycle = new Lifecycle();

            lifecycle.onCreated = (element: HTMLElement) => {
                element.textContent = "TICKERITEM CREATED";
            };
            lifecycle.onDestroyed = (element: HTMLElement) => {
                element.textContent = "TICKERITEM DESTROYED";
            };
            lifecycle.each = (element: HTMLElement) => {
                element.textContent = "TICKERITEM ITERATED";
            };

            const content = async () => await $(`#${Basic.ticker.id}`).$$("*");
            for (const e of await content()) {
                expect(await e.getHTML(false)).not.toEqual(
                    "TICKERITEM CREATED"
                );
            }

            const template = new Template(Basic.ticker);
            const ti = new TickerItem(template, lifecycle);

            ti.appendTo(document.getElementById("test-root")!);

            for (const e of await content()) {
                expect(await e.getHTML(false)).toEqual("TICKERITEM CREATED");
            }

            ti.each();

            for (const e of await content()) {
                expect(await e.getHTML(false)).toEqual("TICKERITEM ITERATED");
            }

            ti.remove();

            ti.appendTo(document.getElementById("test-root")!);
            for (const e of await content()) {
                expect(await e.getHTML(false)).toEqual("TICKERITEM DESTROYED");
            }
        });
    });
});
