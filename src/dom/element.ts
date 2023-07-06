import { MW } from "../manawave";

/**
 * HTML custom element (with no shadowroot) that contains the repeated elements
 */
export default class WebComponent extends HTMLElement {
    private ouroboros: MW | undefined | null;

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.isConnected) {
            this.ouroboros = new MW(this);
        }
    }

    disconnectedCallback() {
        this.ouroboros?.stop();
        this.ouroboros = null;
    }
}
