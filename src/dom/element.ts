import { MW } from "../MW";

/**
 * HTML custom element (with no shadowroot) that contains the repeated elements
 */
export default class WebComponent extends HTMLElement {
    private MW: MW | undefined | null;

    connectedCallback() {
        if (this.isConnected && !this.MW) {
            this.MW = new MW(this);
        }
    }
}
