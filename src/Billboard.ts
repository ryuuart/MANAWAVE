import BillboardManager from "./BillboardManager";
import { TickerSystem } from "./ticker";

// Should be high-level Billboard component
// Logic should be an API-like interface
export default class Billboard {
    ticker: TickerSystem;

    constructor(element: HTMLElement) {
        if (!BillboardManager.hasBillboards) {
            BillboardManager.loadCSS();
        }

        this.ticker = new TickerSystem(element);

        BillboardManager.addBillboard(this);
    }

    init() {}

    deinit() {
        // remove everything from the ticker
        this.ticker.deinit();

        // no longer tracked
        BillboardManager.removeBillboard(this);

        // if there aren't anymore billboards, get rid of the CSS too
        if (!BillboardManager.hasBillboards) {
            BillboardManager.unloadCSS();
        }
    }
}
