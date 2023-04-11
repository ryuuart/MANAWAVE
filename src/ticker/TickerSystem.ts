import { Ticker } from ".";
import { Cloner, Template } from "../clones";

export default class TickerSystem {
    cloner: Cloner;
    ticker: Ticker;

    constructor(element: HTMLElement) {
        this.ticker = new Ticker(element);

        this.cloner = new Cloner();
        this.cloner.register(this.ticker.initialTemplate);

        this.ticker.fillClones(this.cloner.clone(3));
    }
}
