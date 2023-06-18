import { Ouroboros } from "..";

/**
 * HTML ShadowDOM element (with no shadowroot) that contains the repeated elements
 */
export default class WebComponent extends HTMLElement {
    private ouroboros: Ouroboros | undefined | null;

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.isConnected) {
            this.ouroboros = new Ouroboros(this);
        }
    }

    disconnectedCallback() {
        this.ouroboros = null;
    }
}