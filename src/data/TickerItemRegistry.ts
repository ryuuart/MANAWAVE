import { Clone } from "../clones";
import { TickerItem } from "../ticker";

export default class Registry {
    tickerElements: Map<number, TickerItem> = new Map();
    idCounter = 0;

    get allTickerItems() {
        return this.tickerElements.values();
    }

    register(clone: Clone): TickerItem {
        const id = this.idCounter++; // tmp

        const tickerItem = new TickerItem(clone, id);
        this.tickerElements.set(id, tickerItem);

        return tickerItem;
    }

    remove(item: TickerItem | Element | number) {
        if (item instanceof TickerItem) {
            item.remove();
            this.tickerElements.delete(item.id);
        }
        if (item instanceof Element) {
            item.remove();
            this.tickerElements.delete(this.getId(item));
        }
        if (typeof item === "number") {
            const selectedItem = this.get(item);
            selectedItem?.remove();
            this.tickerElements.delete(item);
        }
    }

    clearTickerItems() {
        for (const item of this.allTickerItems) {
            this.remove(item);
        }
    }

    getId(element: Element): number {
        let id = -1;

        const idAttrib = (element as HTMLElement).dataset.id;
        if (idAttrib) id = parseInt(idAttrib);

        return id;
    }

    get(elementOrID: Element | number): TickerItem | null {
        let id;
        if (elementOrID instanceof Element) {
            id = this.getId(elementOrID);
        } else id = elementOrID;

        if (id !== undefined) {
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
