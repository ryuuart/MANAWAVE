import Basic from "~test/pages/basic/Basic";
import { Ticker } from "..";
import { TickerStore } from "~src/data";
import { Cloner } from "~src/clones";
import TickerItemFactory from "../TickerItemFactory";

describe("ticker", () => {
    afterEach(() => {
        Basic.clearContent();
    });

    it("can add a ticker item to the ticker", async () => {
        Basic.loadContent();

        const ticker = new Ticker(Basic.ticker);
        const registry = new TickerStore();
        const cloner = new Cloner();
        cloner.addTemplate(ticker.initialTemplate!);
        const factory = new TickerItemFactory(registry, cloner, ticker);

        const item = factory.create(1)[0];

        ticker.append(item);

        expect(item.isRendered).toBeTruthy();
    });
});
