import Item from "src/lib/Item";
import { Template } from "../clones";
import { TickerStore } from "src/data";
import TickerArtist from "@billboard/lib/TickerArtist";
import Lifecycle from "@billboard/lib/Lifecycle";

export default class TickerItem extends Item {
    timeCreated: DOMHighResTimeStamp;
    lifetime: DOMHighResTimeStamp;
    private _position: Position;
    private _storeRef: TickerStore | null | undefined;
    private _lifecycle: Lifecycle;

    constructor(template: Template, lifecycle: Lifecycle = new Lifecycle()) {
        super(template);
        this._position = this.domPosition;
        this.timeCreated = window.performance.now();
        this.lifetime = 0;

        this._lifecycle = lifecycle;

        // has to happen last!
        this.onCreated();
    }

    registerStore(store: TickerStore) {
        this._storeRef = store;
        if (!this._storeRef.get(this.id)) this._storeRef.add(this);
    }

    remove() {
        if (this._storeRef) {
            this._storeRef.remove(this.id);
            this._storeRef = null;
        }
        this.onDestroyed();
        super.remove();
    }

    appendTo(element: HTMLElement) {
        if (this._storeRef) {
            this._storeRef.add(this);
        }
        super.appendTo(element);
    }

    set position(position: [x: number, y: number]) {
        this._position = position;
    }

    get position(): Position {
        return this._position;
    }

    get domPosition() {
        const transform = this.clone.transformStyle;
        const values = transform.match(/-?\d+/g);
        const output: [x: number, y: number] = [-9999, -9999];

        if (values) {
            output[0] = parseFloat(values[0]);
            output[1] = parseFloat(values[1]);
        }

        return output;
    }

    prepareArtist(artist: TickerArtist) {
        artist.clone = this.clone;
    }

    onCreated() {
        this.clone.onCreated(this._lifecycle.onCreated);
    }
    onDestroyed() {
        this.clone.onDestroyed(this._lifecycle.onDestroyed);
    }
    each() {
        this.clone.each(this._lifecycle.each);
    }
}
