import { Clone } from "../clones";

export default class TickerItem {
    id: number;
    clone: Clone;

    constructor(clone: Clone, id: number) {
        this.id = id;
        this.clone = clone;

        this.clone.element.dataset.id = this.id.toString();
    }

    setPosition(position: [x: number, y: number]) {
        this.clone.setPosition(position);
    }

    getDimensions() {
        return {
            width: this.clone.element.offsetWidth,
            height: this.clone.element.offsetHeight,
        };
    }

    getPosition() {
        const transform = this.clone.element.style.transform;
        const values = transform.match(/\d+/g);
        const output = [-9999, -9999];

        if (values) {
            output[0] = parseInt(values[0]);
            output[1] = parseInt(values[1]);
        }

        return output;
    }

    remove() {
        this.clone.remove();
    }
}
