import Basic from "~test/pages/basic/Basic";
import { Ticker } from "..";
import { TickerItemRegistry } from "~src/data";
import { Cloner } from "~src/clones";
import TickerItemFactory from "../TickerItemFactory";

describe("ticker", () => {
    afterEach(() => {
        Basic.clearContent();
    });

    it("can add a ticker item to the ticker", async () => {
        Basic.loadContent();

        const ticker = new Ticker(Basic.ticker);
        const registry = new TickerItemRegistry();
        const cloner = new Cloner();
        cloner.registerTemplate(ticker.initialTemplate);
        const factory = new TickerItemFactory(registry, cloner, ticker);

        const item = factory.create(1)[0];

        ticker.append(item);

        expect(document.contains(item.clone.element)).toBeTruthy();
    });
});
