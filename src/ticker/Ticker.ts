import { Clone, Cloner, Template } from "../clones";
import Component from "../web/Component";

// Represents front-facing Ticker that is rendered
// Logic for placing clones in front-facing ticker should go here
// Logic representing the system should not go here
export default class Ticker {
    wrapperElement: HTMLElement;
    element: HTMLElement;
    height: number = 0; // needed to make the absolute positioning work

    initialTemplate: Template; // needed to restore the state of the ticker before start

    constructor(element: HTMLElement) {
        // The main element that contains anything relating to Billboard
        this.wrapperElement = element;
        if (!(this.wrapperElement instanceof Component)) {
            this.wrapperElement.classList.add("billboard-ticker");
        }

        // Billboard-ticker refers to what represents the entire Billboard-ticker itself
        // this.element = document.createElement("div");
        this.element = document.createElement("div");
        this.element.classList.add("billboard-ticker-container");

        this.initialTemplate = new Template(this.wrapperElement.children);
        this.wrapperElement.append(this.element);
    }

    init() {}

    fillClones(clones: Clone[]) {
        let pos: [number, number] = [-clones[0].element.offsetWidth, 0];
        for (const clone of clones) {
            this.append(clone);
            if (clone === clones[0]) pos[0] += -clone.element.offsetWidth;
            else pos[0] += clone.element.offsetWidth;
            clone.setPosition(pos);
        }
    }

    append(clone: Clone) {
        this.element.append(clone.element);
        if (clone.element.offsetHeight > this.height) {
            this.height = clone.element.offsetHeight;
            this.element.style.height = `${this.height}px`;
        }
    }
}
