import Basic from "~test/pages/basic/Basic";
import TickerItem from "../TickerItem";
import Ticker from "../Ticker";
import Component from "~src/web/Component";

describe("ticker", () => {
    afterEach(() => {
        Basic.clearContent();
    });

    it("should initialize the parent element when loaded", async () => {
        Basic.loadContent();

        const ticker = new Ticker(Basic.ticker);
        ticker.load();

        const element = await $(`#${Basic.ticker.id}`);

        if (!(Basic.ticker instanceof Component))
            expect(element).toHaveElementClass("billboard-ticker");

        expect(ticker.initialTemplate).toBeTruthy();

        const innerElement = await element.$("*");
        expect(innerElement).toHaveElementClass("billboard-ticker-container");

        expect(ticker.height).not.toEqual(-1);
    });

    it("should return ticker to original when unloaded and remove state", async () => {
        Basic.loadContent();

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
        expect(ticker.height).toEqual(-1);
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

        const ticker = new Ticker(Basic.ticker);

        Basic.ticker.style.height = "9px";

        ticker.load();
        ticker.height = 1234;

        expect(ticker.height).toEqual(9);

        ticker.unload();

        Basic.ticker.style.maxHeight = "99px";
        Basic.ticker.style.height = "200px";

        ticker.load();
        ticker.height = 1234;

        expect(ticker.height).toEqual(99);

        ticker.unload();

        Basic.ticker.style.minHeight = "999px";
        Basic.ticker.style.height = "9px";

        ticker.load();
        ticker.height = 1234;

        expect(ticker.height).toEqual(999);
    });
});
