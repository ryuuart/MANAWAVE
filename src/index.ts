import BillboardTicker from "./BillboardTicker";

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
      this.initCSS();

      customElements.define("billboard-ticker", BillboardTicker);
    }
  }

  initCSS() {
    const styleElement = document.createElement("style");
    document.head.append(styleElement);

    if (styleElement.sheet) {
      styleElement.sheet.insertRule(`
        billboard-ticker {
          white-space: nowrap;
          overflow: hidden;
          
          display: block;

          border: 1px solid red;
        }
      `);
      styleElement.sheet.insertRule(`
        .billboard-ticker {
          position: relative;

          display: flow-root;

          right: 100%;
        }
      `);
      styleElement.sheet.insertRule(`
        .ticker-element-temp {
          display: inline-block;
        }
      `);
      styleElement.sheet.insertRule(`
        .ticker-element {
          position: absolute;

          will-change: transform;

          display: inline-block;
        }
      `);
    }
  }
}

export default new BillboardManager();
