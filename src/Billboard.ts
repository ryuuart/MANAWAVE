import { TickerSystem } from "./ticker";

// Should be high-level Billboard component
// Logic should be an API-like interface
export default class Billboard {
    ticker: TickerSystem;

    constructor(element: HTMLElement) {
        this.ticker = new TickerSystem(element);
    }
}
