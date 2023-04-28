import { debounce } from "~src/utils";
import { Ticker, TickerItem } from ".";
import { TickerStore } from "../data";
import TickerItemFactory from "./TickerItemFactory";

export default class TickerSystem {
    ticker: Ticker;
    tickerItemStore: TickerStore;
    tickerItemFactory: TickerItemFactory;

    constructor(element: HTMLElement) {
        this.ticker = new Ticker(element);
        this.tickerItemStore = new TickerStore();

        this.tickerItemFactory = new TickerItemFactory(
            this.tickerItemStore,
            this.ticker
        );

        window.addEventListener(
            "resize",
            debounce(this.resize.bind(this), 500)
        );
        this.ticker.initClones(this.tickerItemFactory);
    }

    // remove all clones and templates
    clear() {
        for (const item of this.tickerItemStore.allTickerItems) {
            item.remove();
        }
        this.tickerItemFactory.clearTemplates();
    }

    init() {
        this.tickerItemFactory.addTemplate(this.ticker.initialTemplate!);
        this.ticker.initClones(this.tickerItemFactory);
    }

    deinit() {
        this.clear();
        this.ticker.deinit();
    }

    resize() {
        this.clear();
        this.ticker.updateHeight();
        this.init();
    }
}
