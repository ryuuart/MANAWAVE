import { wrappedDiv } from "../dom";
export default class Template {
    element: HTMLElement;

    constructor(element: Parameters<typeof wrappedDiv>[0]) {
        // Element represents the element to be repeated (the template if you will)
        this.element = wrappedDiv(element);
        this.element.classList.add("ticker-element-temp");
    }
}
