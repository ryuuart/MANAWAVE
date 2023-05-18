import BillboardManager from "@billboard/BillboardManager";
import Billboard from "../Billboard";

/**
 * HTML ShadowDOM element (with no shadowroot) that contains the repeated elements
 */
export default class Component extends HTMLElement {
    billboard: Billboard | undefined | null;
    constructor() {
        super();
    }

    connectedCallback() {
        if (this.isConnected) {
            this.billboard = new Billboard(this);
        }
    }

    disconnectedCallback() {
        this.billboard?.deinit();
        this.billboard = null;
    }
}
