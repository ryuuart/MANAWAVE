import { Clone } from "../clones";
import { TickerItem } from "../ticker";

export default class Registry {
    tickerElements: Map<number, TickerItem> = new Map();
    idCounter = 0;

    register(clone: Clone) {
        const id = this.idCounter++; // tmp

        const tickerElement = new TickerItem(clone);
        this.tickerElements.set(id, tickerElement);
    }

    getId(element: Element): number {
        let id;

        const idAttrib = (element as HTMLElement).dataset.id;
        if (idAttrib) id = parseInt(idAttrib);

        return id;
    }

    get(elementOrID: Element | number): TickerItem | null {
        let id;
        if (elementOrID instanceof Element) {
            id = this.getId(elementOrID);
        } else id = elementOrID;

        if (id || id !== undefined) {
            const tickerElement = this.tickerElements.get(id);
            if (tickerElement) return tickerElement;
            else {
                console.error("Element not registered.");
                return null;
            }
        } else {
            console.error("ID Data is missing.");
            return null;
        }
    }
}
