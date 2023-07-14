import { MW } from "./manawave";

class MWManager {
    private _registry: Map<HTMLElement, MW>;

    constructor() {
        this._registry = new Map();
    }

    get(element: HTMLElement): MW | undefined {
        return this._registry.get(element);
    }

    register(element: HTMLElement, mw: MW) {
        this._registry.set(element, mw);
    }

    deregister(element: HTMLElement) {
        this._registry.delete(element);
    }
}

export default new MWManager();
