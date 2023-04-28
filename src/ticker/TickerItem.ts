import Item from "~src/lib/Item";
import { Template } from "../clones";
import { TickerStore } from "~src/data";

export default class TickerItem extends Item {
    private _storeRef: TickerStore | null | undefined;
    constructor(template: Template) {
        super(template);
    }

    registerStore(store: TickerStore) {
        this._storeRef = store;
    }

    remove() {
        if (this._storeRef) {
            this._storeRef.remove(this.id);
            this._storeRef = null;
        }
        super.remove();
    }

    appendTo(element: HTMLElement) {
        if (this._storeRef) {
            this._storeRef.add(this);
        }
        super.appendTo(element);
    }

    set position(position: [x: number, y: number]) {
        this.clone.setPosition(position);
    }

    get position() {
        const transform = this.clone.transformStyle;
        const values = transform.match(/\d+/g);
        const output: [x: number, y: number] = [-9999, -9999];

        if (values) {
            output[0] = parseInt(values[0]);
            output[1] = parseInt(values[1]);
        }

        return output;
    }
}
