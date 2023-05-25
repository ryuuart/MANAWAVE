import Component from "src/web/Component";
import Basic from "test/pages/basic/Basic";
import Ticker from "../Ticker";
import TickerItem from "../TickerItem";

describe("ticker", () => {
    afterEach(() => {
        Basic.clearContent();
    });

    it("should initialize the parent element when loaded", async () => {
        Basic.loadContent();

        const initialHeight = await $(`#${Basic.ticker.id}`).getSize("height");
        const initialWidth = await $(`#${Basic.ticker.id}`).getSize("width");

        const ticker = new Ticker(Basic.ticker);
        ticker.load();

        const element = await $(`#${Basic.ticker.id}`);

        if (!(Basic.ticker instanceof Component))
            expect(element).toHaveElementClass("billboard-ticker");

        expect(ticker.initialTemplate).toBeTruthy();

        const innerElement = await element.$("*");
        expect(innerElement).toHaveElementClass("billboard-ticker-container");
        expect(await element.getSize("height")).toEqual(initialHeight);
        expect(await element.getSize("width")).toEqual(initialWidth);
    });

    it("should return ticker to original when unloaded and remove state", async () => {
        Basic.loadContent();

        const initialHeight = await $(`#${Basic.ticker.id}`).getSize("height");
        const initialWidth = await $(`#${Basic.ticker.id}`).getSize("width");

        const ticker = new Ticker(Basic.ticker);
        ticker.load();

        const element = await $(`#${Basic.ticker.id}`);

        ticker.unload();

        if (!(Basic.ticker instanceof Component))
            expect(element).not.toHaveElementClass("billboard-ticker");

        expect(ticker.initialTemplate).toBeFalsy();
        expect(
            await element.$(".billboard-ticker-container")
        ).not.toBeDisplayed();
        expect(await element.getSize("height")).toEqual(initialHeight);
        expect(await element.getSize("width")).toEqual(initialWidth);
    });

    it("can add a ticker item to the ticker", async () => {
        Basic.loadContent();

        const ticker = new Ticker(Basic.ticker);
        ticker.load();

        const tickerItem = new TickerItem(ticker.initialTemplate!);

        ticker.append(tickerItem);

        expect(tickerItem.isRendered).toBeTruthy();
    });

    it("should have dimensions given an element with a size is already inside", async () => {
        Basic.loadContent();

        const ticker = new Ticker(Basic.ticker);
        ticker.load();

        const tickerItem = new TickerItem(ticker.initialTemplate!);

        ticker.append(tickerItem);

        expect(ticker.dimensions.width).toBeGreaterThan(0);
        expect(ticker.dimensions.height).toBeGreaterThan(0);
    });

    it("should be uninitialized by default", async () => {
        Basic.loadContent();

        const ticker = new Ticker(Basic.ticker);

        const observedTicker = await $("#ticker");

        expect(ticker.initialTemplate).toBeFalsy();
        expect(observedTicker).not.toHaveElementClass("billboard-ticker");

        const children = await observedTicker.$$("*");

        for (const child of children) {
            expect(child).not.toHaveElementClass("billboard-clone");
        }
    });

    it("should use parent element height if explicitly defined", async () => {
        Basic.loadContent();

        async function getDimensions() {
            const element = await $(Basic.ticker);

            return {
                width: await element.getSize("width"),
                height: await element.getSize("height"),
            };
        }

        const ticker = new Ticker(Basic.ticker);

        Basic.ticker.style.height = "9px";

        ticker.load();

        expect((await getDimensions()).height).toEqual(9);

        ticker.unload();

        Basic.ticker.style.maxHeight = "99px";
        Basic.ticker.style.height = "200px";

        ticker.load();

        expect((await getDimensions()).height).toEqual(99);

        ticker.unload();

        Basic.ticker.style.minHeight = "999px";
        Basic.ticker.style.height = "9px";

        ticker.load();

        expect((await getDimensions()).height).toEqual(999);
    });
});
