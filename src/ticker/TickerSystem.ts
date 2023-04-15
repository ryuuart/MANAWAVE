import { Ticker } from ".";
import { Cloner, Template } from "../clones";
import { TickerItemRegistry } from "../data";

export default class TickerSystem {
    cloner: Cloner;
    ticker: Ticker;
    tickerItemRegistry: TickerItemRegistry;

    constructor(element: HTMLElement) {
        this.ticker = new Ticker(element);

        this.tickerItemRegistry = new TickerItemRegistry();

        this.cloner = new Cloner(this.ticker);
        this.cloner.register(this.ticker.initialTemplate);

        this.ticker.initClones(this.cloner);
    }

    init() {}
}
