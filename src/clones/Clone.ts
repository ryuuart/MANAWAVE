import { setTranslate, wrappedDiv } from "src/dom";
import Template from "./Template";
import styles from "src/web/clone.module.css";

export default class Clone {
    private _element: HTMLElement;
    private _width: number;
    private _height: number;

    constructor(template: Template) {
        // Element-wrapper refers to a wrapper that allows for dimensional calculations
        // What you want to clone
        this._element = wrappedDiv(template.element.cloneNode(true));
        this._element.classList.add(styles.clone);

        this._width = template.width;
        this._height = template.height;

        // Just add it in some far off corner so it's not visible yet.
        this.setPosition([-9999, -9999]);
    }

    setPosition(position: [x: number, y: number]) {
        setTranslate(this._element, position);
    }

    appendTo(element: HTMLElement) {
        element.append(this._element);
    }

    remove() {
        this._element.remove();
    }

    get isRendered(): boolean {
        return document.contains(this._element);
    }

    set id(id: number) {
        this._element.dataset.id = id.toString();
    }

    get id(): number {
        const id = this._element.dataset.id;
        return parseInt(id ?? "-999");
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    set transformStyle(style: string) {
        this._element.style.transform = style;
    }

    get transformStyle(): string {
        return this._element.style.transform;
    }

    onCreated(callback: (element: HTMLElement) => void) {
        for (const element of this._element.firstElementChild!.children) {
            callback(element as HTMLElement);
        }
    }

    onDestroyed(callback: (element: HTMLElement) => void) {
        for (const element of this._element.firstElementChild!.children) {
            callback(element as HTMLElement);
        }
    }

    each(callback: (element: HTMLElement) => void) {
        for (const element of this._element.firstElementChild!.children) {
            callback(element as HTMLElement);
        }
    }
}
