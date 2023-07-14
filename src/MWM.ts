import { MW } from "./MW";

/**
 * Keeps a record of all manawave tickers to retrieve and consume
 */
class MWManager {
    private _registry: Map<HTMLElement, MW>;

    constructor() {
        this._registry = new Map();
    }

    /**
     * Retrieves a manawave ticker from its root element
     * @param element root element of a manawave ticker
     * @returns main {@link MW} used to control the manawave ticker
     */
    get(element: HTMLElement): MW | undefined {
        return this._registry.get(element);
    }

    /**
     * Registers a root element with its manawave ticker
     * @param element root element of the manawave ticker
     * @param mw the associated {@link MW } object used to control the manawave ticker
     */
    register(element: HTMLElement, mw: MW) {
        this._registry.set(element, mw);
    }

    /**
     * Removes the association between the root element and the manawave ticker. In
     * other words, it's being destroyed.
     * @param element root element of the manawave ticker
     */
    deregister(element: HTMLElement) {
        this._registry.delete(element);
    }
}

export default new MWManager();
