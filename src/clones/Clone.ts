import { setTranslate } from "../dom";
import Template from "./Template";

export default class Clone {
    element: HTMLElement;

    constructor(template: Template) {
        // Element-wrapper refers to a wrapper that allows for dimensional calculations
        // What you want to clone
        this.element = template.element.cloneNode(true) as HTMLElement;
        this.element.classList.add("ticker-element");

        // Just add it in some far off corner so it's not visible yet.
        this.setPosition([-9999, -9999]);
    }

    setPosition(position: [x: number, y: number]) {
        setTranslate(this.element, position);
    }

    remove() {
        this.element.remove();
    }
}
