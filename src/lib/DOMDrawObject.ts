import { DrawObject } from "@billboard/anim";

export default class DOMDrawObject extends DrawObject {
    element: Element;

    constructor(element: Element) {
        super();

        this.element = element;
    }
}
