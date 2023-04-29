import BillboardManager from "./BillboardManager";
import { TickerSystem } from "./ticker";
import { debounce } from "./utils";

const defaultConfig: Billboard.Options = {
    autoplay: true,
};

// Should be high-level Billboard component
// Logic should be an API-like interface
export default class Billboard {
    private _system: TickerSystem;
    private _config: Billboard.Options = defaultConfig;

    constructor(element: HTMLElement, options?: Billboard.Options) {
        Object.assign(this._config, options);

        if (!BillboardManager.hasBillboards) {
            BillboardManager.loadCSS();
        }

        this._system = new TickerSystem(element);

        BillboardManager.addBillboard(this);

        window.addEventListener(
            "resize",
            debounce(this.resize.bind(this), 500)
        );

        if (this._config.autoplay) this.init();
    }

    init() {
        this._system.load();
    }

    deinit() {
        // remove everything from the ticker
        this._system.unload();

        // no longer tracked
        BillboardManager.removeBillboard(this);

        // if there aren't anymore billboards, get rid of the CSS too
        if (!BillboardManager.hasBillboards) {
            BillboardManager.unloadCSS();
        }
    }

    resize() {
        this.init();
        this.deinit();
    }
}
