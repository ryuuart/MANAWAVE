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
    private _initialized: boolean;

    constructor(element: HTMLElement, options?: Billboard.Options) {
        Object.assign(this._config, options);

        this._initialized = false;
        this._system = new TickerSystem(element);

        BillboardManager.addBillboard(this);

        window.addEventListener(
            "resize",
            debounce(this.resize.bind(this), 500)
        );

        if (this._config.autoplay) this.init();
    }

    init() {
        if (!this._initialized) {
            this._system.load();
            this._initialized = true;
        }
    }

    deinit() {
        // remove everything from the ticker
        this._system.unload();

        // no longer tracked
        BillboardManager.removeBillboard(this);

        this._initialized = false;
    }

    resize() {
        this.deinit();
        this.init();
    }
}
