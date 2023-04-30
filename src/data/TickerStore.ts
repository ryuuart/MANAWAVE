import { Clone } from "../clones";
import { TickerItem } from "../ticker";

export default class TickerStore {
    private _tickerItems: Map<number, TickerItem> = new Map();

    get allTickerItems() {
        return this._tickerItems.values();
    }

    add(item: TickerItem): TickerItem {
        this._tickerItems.set(item.id, item);

        return item;
    }

    remove(item: TickerItem | Element | number) {
        let id;
        if (item instanceof TickerItem) {
            id = item.id;
        }
        if (item instanceof Element) {
            id = this.getId(item);
        }
        if (typeof item === "number") {
            id = item;
        }

        if (id) this._tickerItems.delete(id);
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
            const tickerElement = this._tickerItems.get(id);
            if (tickerElement) return tickerElement;
            else {
                return null;
            }
        } else {
            return null;
        }
    }

    get isEmpty() {
        return this._tickerItems.size === 0;
    }
}
