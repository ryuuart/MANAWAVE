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

    it("should retrieve an item given a condition", async () => {
        Basic.loadContent();

        const system = new TickerSystem(Basic.ticker);
        system.load();

        const items = system.getItemsByCondition((item) => {
            return item.position[0] === item.dimensions.width;
        });

        await expect(items.length).toBeGreaterThan(0);
    });

    it("should retrieve an item given an id", async () => {
        Basic.loadContent();

        const system = new TickerSystem(Basic.ticker);
        system.load();

        const renderedItem = await $(Basic.ticker).$("*/*[1]");
        const id = parseInt(await renderedItem.getAttribute("data-id"));
        const item = system.getItemById(id);

        await expect(item).toBeTruthy();
    });

    it("should retrieve an item given an element", async () => {
        Basic.loadContent();

        const system = new TickerSystem(Basic.ticker);
        system.load();

        // I'm not sure why this querySelector needs a third child
        // the 2nd :first-child returns the same as the first :/
        const element = Basic.ticker.querySelector(
            ":first-child>:first-child>:first-child"
        );

        const item = system.getItemByElement(element!);

        await expect(item).toBeTruthy();
    });

    it("should remove an item retroactively", async () => {});

    it("should remove a list of items retroactively", async () => {});

    it("add a single item to the ticker retroactively", async () => {
        Basic.loadContent();

        const system = new TickerSystem(Basic.ticker);
        system.load();

        const position: Position = [1234, 1235];
        system.addItem(position);

        const element = await $(Basic.ticker).$(
            `div[style="transform: translate(${position[0]}px, ${position[1]}px);"]`
        );

        await expect(element).toHaveStyle({
            transform: `matrix(1, 0, 0, 1, ${position[0]}, ${position[1]})`,
        });
    });

    it("add a multiple items to the ticker retroactively", async () => {
        Basic.loadContent();

        const system = new TickerSystem(Basic.ticker);
        system.load();

        const position: Position = [1234, 1235];
        const count = 10;
        system.addNItem(count, (i) => {
            return [position[0] + i, position[1] + i];
        });

        const elements: WebdriverIO.Element[] = [];
        for (let i = 0; i < count; i++) {
            const element = await $(Basic.ticker).$(
                `div[style="transform: translate(${position[0] + i}px, ${
                    position[1] + i
                }px);"]`
            );
            elements.push(element);
        }

        for (const [i, e] of elements.entries()) {
            await expect(e).toHaveStyle({
                transform: `matrix(1, 0, 0, 1, ${position[0] + i}, ${
                    position[1] + i
                })`,
            });
        }
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
