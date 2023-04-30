import { Clone, Template } from "~src/clones";

function* genId(): Generator<number, any> {
    let id = 0;
    while (true) {
        yield id++;
    }
}

export default class Item {
    private static genId = genId();

    private _id: number;
    protected clone: Clone;

    constructor(template: Template) {
        this.clone = new Clone(template);

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
}
