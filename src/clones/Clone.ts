import { setTranslate } from "../dom";
import CloneState from "./CloneState";
import Template from "./Template";

export default class Clone {
    state: CloneState;
    element: HTMLElement;

    constructor(template: Template) {
        // Element-wrapper refers to a wrapper that allows for dimensional calculations
        // What you want to clone
        this.element = template.element.cloneNode(true) as HTMLElement;
        this.element.classList.add("ticker-element");

        this.state = new CloneState();

        // Just add it in some far off corner so it's not visible yet.
        this.setPosition([-9999, -9999]);
    }

    setPosition(position: [x: number, y: number]) {
        this.state.setPosition(position);

        setTranslate(this.element, position);
    }
}
