import Billboard from "./Billboard";
import Component from "./web/Component";

/**
 * The main class used to set up the Billboard all in one spot
 */
class BillboardManager {
    /**
     * Set up, configure, and control the overall Billboard system
     * @param {string} id the ID we use to select for the main slider
     * @param {string} options the options provided for the overall Billboard system
     */
    constructor() {
        if (!customElements.get("billboard-ticker")) {
            customElements.define("billboard-ticker", Component);
        }
    }
}

export const billboard = new BillboardManager();
export { Billboard };
