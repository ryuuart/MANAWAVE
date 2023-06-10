export abstract class Component<T extends HTMLElement = HTMLElement> {
    protected html: T;

    constructor(element: T) {
        this.html = element;
    }
}
