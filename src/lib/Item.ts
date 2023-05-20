import { Clone, Template } from "src/clones";
import Lifecycle from "./Lifecycle";

function* genId(): Generator<number, any> {
    let id = 0;
    while (true) {
        yield id++;
    }
}

export default class Item {
    private static genId = genId();

    private _id: number;
    private _lifecycle: Lifecycle;

    protected clone: Clone;

    constructor(template: Template, lifecycle: Lifecycle = new Lifecycle()) {
        this.clone = new Clone(template);
        this._lifecycle = lifecycle;

        this._id = Item.genId.next().value;
        this.clone.id = this._id;
    }

    get isRendered(): boolean {
        return this.clone.isRendered;
    }

    get id() {
        return this._id;
    }

    get dimensions() {
        return {
            width: this.clone.width,
            height: this.clone.height,
        };
    }

    appendTo(element: HTMLElement) {
        this.clone.appendTo(element);
    }

    remove() {
        this.clone.remove();
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
