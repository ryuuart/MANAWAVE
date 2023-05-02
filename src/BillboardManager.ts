import "./web/style.css";
import Billboard from "./Billboard";

/**
 * The main class used to set up the Billboard all in one spot
 */
class BillboardManager {
    billboards: Set<Billboard>;

    /**
     * Set up, configure, and control the overall Billboard system
     * @param {string} id the ID we use to select for the main slider
     * @param {string} options the options provided for the overall Billboard system
     */
    constructor() {
        this.billboards = new Set();
    }

    addBillboard(billboard: Billboard) {
        this.billboards.add(billboard);
    }

    removeBillboard(billboard: Billboard) {
        this.billboards.delete(billboard);
    }

    get hasBillboards() {
        return this.billboards.size > 0;
    }
}

export default new BillboardManager();
