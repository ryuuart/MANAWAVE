import BillboardManager from "./BillboardManager";
import { AnimationController } from "./anim";
import { TickerSystem } from "./ticker";
import { debounce } from "./utils";

const defaultConfig: Billboard.Options = {
    autoplay: true,
    speed: 1,
    direction: 0,
};

// Should be high-level Billboard component
// Logic should be an API-like interface
export default class Billboard {
    private _system: TickerSystem;
    private _config: Billboard.Options = defaultConfig;
    private _initialized: boolean;
    private _onResize: () => void;

    private _speed: number;
    private _direction: number;

    constructor(element: HTMLElement, options?: Billboard.Options) {
        this._speed = defaultConfig.speed!;
        this._direction = defaultConfig.direction! as number;

        this._config = {};
        Object.assign(this._config, defaultConfig, options);

        this._initialized = false;
        this._system = new TickerSystem(element);

        BillboardManager.addBillboard(this);

        this._onResize = debounce(this.resize.bind(this), 250);

        if (this._config.speed !== undefined) this._speed = this._config.speed;
        if (this._config.direction) this.direction = this._config.direction;

        setTimeout(() => {
            this.init();
        }, 5);
    }

    set direction(directionAttr: Billboard.Options["direction"]) {
        switch (directionAttr) {
            case "up":
                this._direction = 90;
                break;
            case "left":
                this._direction = 180;
                break;
            case "right":
                this._direction = 0;
                break;
            case "down":
                this._direction = 270;
                break;
            case null:
                break;
            default:
                if (typeof directionAttr === "string") {
                    const angle = parseFloat(directionAttr);

                    if (angle) {
                        this._direction = angle;
                    }
                }
        }
    }

    onItemCreated(callback: (element: HTMLElement) => void) {
        this._system.setOnItemCreated(callback);
    }

    onItemDestroyed(callback: (element: HTMLElement) => void) {
        this._system.setOnItemDestroyed(callback);
    }

    each(callback: (element: HTMLElement) => void) {
        this._system.setEachItem(callback);
    }

    init() {
        if (!this._initialized) {
            this._system.speed = this._speed;
            this._system.direction = this._direction;
            this._system.start();
            this._system.load();

            if (!this._config.autoplay) this._system.pause();

            window.addEventListener("resize", this._onResize);

            // load animation to the system
            AnimationController.registerSystem(this._system);

            this._initialized = true;
        }
    }

    deinit() {
        // remove everything from the ticker
        this._system.unload();
        this._system.stop();

        window.removeEventListener("resize", this._onResize);

        // unload animation to the system
        AnimationController.deregisterSystem(this._system);

        // no longer tracked
        BillboardManager.removeBillboard(this);

        this._initialized = false;
    }

    resize() {
        this.deinit();
        setTimeout(() => {
            this.init();
        }, 0);
    }
}
