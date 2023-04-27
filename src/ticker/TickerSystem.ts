import { debounce } from "~src/utils";
import { Ticker, TickerItem } from ".";
import { Cloner, Template } from "../clones";
import { TickerStore } from "../data";
import TickerItemFactory from "./TickerItemFactory";

export default class TickerSystem {
    cloner: Cloner;
    ticker: Ticker;
    tickerItemRegistry: TickerStore;
    tickerItemFactory: TickerItemFactory;

    constructor(element: HTMLElement) {
        this.ticker = new Ticker(element);

        this.tickerItemRegistry = new TickerStore();

        this.cloner = new Cloner();
        this.cloner.addTemplate(this.ticker.initialTemplate!);

        // a bit apprehensive this is here
        // I feel like it has such heavy connection to
        // 3 classes yet is supposed to be used in
        // any context without injection
        this.tickerItemFactory = new TickerItemFactory(
            this.tickerItemRegistry,
            this.cloner,
            this.ticker
        );

        window.addEventListener(
            "resize",
            debounce(this.resize.bind(this), 500)
        );
        this.ticker.initClones(this.tickerItemFactory);
    }

    addTickerItem(item: TickerItem) {
        item.registerStore(this.tickerItemRegistry);
        this.tickerItemRegistry.add(item);
    }

    removeTickerItem(item: TickerItem) {
        this.tickerItemRegistry.remove(item);
    }

    // remove all clones and templates
    clear() {
        this.tickerItemRegistry.clearTickerItems();
        this.cloner.clearTemplates();
    }

    init() {
        this.cloner.addTemplate(this.ticker.initialTemplate!);
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
