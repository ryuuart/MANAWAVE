import { Ticker } from ".";
import { Cloner, Template } from "../clones";
import { TickerItemRegistry } from "../data";
import TickerItemFactory from "./TickerItemFactory";

export default class TickerSystem {
    cloner: Cloner;
    ticker: Ticker;
    tickerItemRegistry: TickerItemRegistry;
    tickerItemFactory: TickerItemFactory;

    constructor(element: HTMLElement) {
        this.ticker = new Ticker(element);

        this.tickerItemRegistry = new TickerItemRegistry();

        this.cloner = new Cloner();
        this.cloner.register(this.ticker.initialTemplate);

        // a bit apprehensive this is here
        // I feel like it has such heavy connection to
        // 3 classes yet is supposed to be used in
        // any context without injection
        this.tickerItemFactory = new TickerItemFactory(
            this.tickerItemRegistry,
            this.cloner,
            this.ticker
        );

        this.ticker.initClones(this.tickerItemFactory);
    }

    init() {}
}
