import { MW } from "./MW";

/**
 * Keeps a record of all manawave marquees to retrieve and consume
 */
class MWManager {
    private _registry: Map<HTMLElement, MW>;

    constructor() {
        this._registry = new Map();
    }

    /**
     * Retrieves a manawave marquee from its root element
     * @param element root element of a manawave marquee
     * @returns main {@link MW} used to control the manawave marquee
     */
    get(element: HTMLElement): MW | undefined {
        return this._registry.get(element);
    }

    /**
     * Registers a root element with its manawave marquee
     * @param element root element of the manawave marquee
     * @param mw the associated {@link MW } object used to control the manawave marquee
     */
    register(element: HTMLElement, mw: MW) {
        this._registry.set(element, mw);
    }

    /**
     * Removes the association between the root element and the manawave marquee. In
     * other words, it's being destroyed.
     * @param element root element of the manawave marquee
     */
    deregister(element: HTMLElement) {
        this._registry.delete(element);
    }
}

export default new MWManager();
