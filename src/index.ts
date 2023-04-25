import Billboard from "./Billboard";
import Component from "./web/Component";

/**
 * The main class used to set up the Billboard all in one spot
 */
class BillboardManager {
    styleElement: HTMLStyleElement = document.createElement("style");

    /**
     * Set up, configure, and control the overall Billboard system
     * @param {string} id the ID we use to select for the main slider
     * @param {string} options the options provided for the overall Billboard system
     */
    constructor() {
        this.loadCSS();

        if (!customElements.get("billboard-ticker")) {
            customElements.define("billboard-ticker", Component);
        }
    }

    loadCSS() {
        if (!document.head.contains(this.styleElement)) {
            document.head.append(this.styleElement);
            if (this.styleElement.sheet) {
                this.styleElement.sheet.insertRule(`
                        billboard-ticker, .billboard-ticker {
                            white-space: nowrap;
                            overflow: hidden;
                            
                            display: block;
                            
                            border: 1px solid red;
                        }
                        `);
                this.styleElement.sheet.insertRule(`
                        .billboard-ticker-container {
                            position: relative;
                            
                            display: flow-root;
                        }
                        `);
                this.styleElement.sheet.insertRule(`
                        .ticker-element-temp {
                            display: inline-block;
                        }
                        `);
                this.styleElement.sheet.insertRule(`
                        .ticker-element {
                            position: absolute;
                            
                            will-change: transform;
                            
                            display: inline-block;
                        }
                        `);
            }
        }
    }

    unloadCSS() {
        this.styleElement.remove();
    }
}

export const billboardManager = new BillboardManager();
export { Billboard };
