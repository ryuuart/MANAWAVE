import Basic from "test/pages/basic/Basic";
import { Template } from "src/clones";
import { TickerStore } from "src/data";
import Square from "test/pages/square/Square";
import Ticker from "../Ticker";
import TickerItemFactory from "../TickerItemFactory";
import TickerSystem from "../TickerSystem";

describe("system", () => {
    afterEach(() => {
        Basic.clearContent();
        Square.clearContent();
    });

    // Does not guarantee it is laid out properly, only that it runs
    it("can fill the ticker with some items", async () => {
        Basic.loadContent();

        const system = new TickerSystem(Basic.ticker);
        system.load();

        system.fill();

        const tickerElement = await $(`#${Basic.ticker.id}`);
        const clones = await tickerElement.$$("* > *");
        expect(clones.length).toBeGreaterThan(0);
    });

    it("should clear the ticker given the command", async () => {
        Basic.loadContent();

        const system = new TickerSystem(Basic.ticker);
        system.load();

        system.fill();

        const tickerElement = await $(`#${Basic.ticker.id}`);

        system.clear();

        const clones = await tickerElement.$$("* > .billboard-clone");
        expect(clones.length).toEqual(0);
    });

    describe("factory", () => {
        it("should not create more items if there are no templates", async () => {
            Basic.loadContent();

            const ticker = new Ticker(Basic.ticker);
            const store = new TickerStore();
            const factory = new TickerItemFactory(store, ticker);

            factory.clearTemplates();

            const tickerItems = factory.create(100);

            expect(tickerItems.length).toStrictEqual(0);
        });

        it("should initialize with a template", async () => {
            Basic.loadContent();

            const ticker = new Ticker(Basic.ticker);
            ticker.load();

            const store = new TickerStore();
            const factory = new TickerItemFactory(store, ticker);

            expect(factory.templateIsEmpty).toBeFalsy();
        });

        it("can add and remove a given template", async () => {
            Basic.loadContent();
            Square.loadContent();

            const ticker = new Ticker(Basic.ticker);
            const store = new TickerStore();
            const factory = new TickerItemFactory(store, ticker);

            // remove the initial template
            factory.clearTemplates();

            const template = new Template(Square.square);
            factory.addTemplate(template);

            expect(factory.templateIsEmpty).toBeFalsy();

            factory.removeTemplate(template);

            expect(factory.templateIsEmpty).toBeTruthy();
        });

        it("can create a number of ticker items", async () => {
            Basic.loadContent();

            const ticker = new Ticker(Basic.ticker);
            ticker.load();

            const store = new TickerStore();
            const factory = new TickerItemFactory(store, ticker);

            const AMOUNT = 100;
            const tickerItems = factory.create(AMOUNT);

            expect(tickerItems.length).toEqual(AMOUNT);
            for (let i = 0; i < AMOUNT; i++) {
                expect(tickerItems[i]).toEqual(store.get(tickerItems[i].id));
            }
        });

        // Can't really verify unless we hard check the elements
        // But since we're unsure the state of a sequence, we'll
        // do a simple functionality check for now.
        it("can create a sequence", async () => {
            Basic.loadContent();
            Square.loadContent();

            const ticker = new Ticker(Basic.ticker);
            ticker.load();

            const store = new TickerStore();
            const factory = new TickerItemFactory(store, ticker);

            const template = new Template(Square.square);
            factory.addTemplate(template);

            const sequence = factory.sequence();

            expect(sequence.length).toEqual(2);
        });
    });
});
