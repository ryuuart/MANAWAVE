import { Clone } from "../clones";

export default class TickerItem {
    clone: Clone;

    constructor(clone: Clone) {
        this.clone = clone;
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
}
