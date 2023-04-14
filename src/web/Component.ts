import TickerSystem from "../Billboard";

/**
 * HTML ShadowDOM element (with no shadowroot) that contains the repeated elements
 */
export default class Component extends HTMLElement {
    tickerSystem: TickerSystem;
    constructor() {
        super();

        this.tickerSystem = new TickerSystem(this);
    }
}
