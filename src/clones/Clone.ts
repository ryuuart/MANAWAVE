import { setTranslate } from "../dom";
import { cloneChild, wrappedDiv } from "../dom/DOM";
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
    }

    setPosition(position: [x: number, y: number]) {
        this.state.setPosition(position);

        setTranslate(this.element, position);
    }
}
