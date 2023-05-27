import BillboardManager from "@billboard/BillboardManager";
import Billboard from "../Billboard";
import { speed } from "animejs";

/**
 * HTML ShadowDOM element (with no shadowroot) that contains the repeated elements
 */
export default class Component extends HTMLElement {
    billboard: Billboard | undefined | null;

    private _autoplay: boolean;
    private _speed: number | undefined | null;
    private _direction: Billboard.Options["direction"];

    constructor() {
        super();

        this._autoplay = this.hasAttribute("autoplay");

        const directionAttr = this.getAttribute("direction");
        if (directionAttr) this._direction = directionAttr;
        const speedAttr = this.getAttribute("speed");
        if (speedAttr) this._speed = parseFloat(speedAttr);
    }

    connectedCallback() {
        if (this.isConnected) {
            const options: Billboard.Options = { autoplay: this._autoplay };
            if (this._speed !== null && this._speed !== undefined) {
                if (this._speed < 0) {
                    this._speed = 0;
                }
                options.speed = this._speed;
            }
            if (this._direction) options.direction = this._direction;

            this.billboard = new Billboard(this, options);
        }
    }

    disconnectedCallback() {
        this.billboard?.deinit();
        this.billboard = null;
    }
}
