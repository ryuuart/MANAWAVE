import { wrappedDiv, moveElements, isDOMList } from "src/dom";
import styles from "src/web/clone.module.css";

export default class Template {
    private _originalParent: HTMLElement | null;
    private _original: Parameters<typeof wrappedDiv>[0];

    private _element: HTMLElement;
    private _width: number;
    private _height: number;

    constructor(element: Parameters<typeof wrappedDiv>[0]) {
        // Track the original for restoration
        this._original = element;
        if (isDOMList(this._original))
            this._originalParent = this._original[0].parentElement;
        else this._originalParent = this._original.parentElement;

        // Element represents the element to be repeated (the template if you will)
        this._element = wrappedDiv(this._original);
        this._element.classList.add(styles.template);

        this._originalParent?.append(this._element);
        this._width = this._element.offsetWidth;
        this._height = this._element.offsetHeight;
        this._element.remove();

        // recover the original after modification, unique hack...
        // what's happening is that the original became the this.element
        this._original = this._element.children;
    }

    get element() {
        return this._element;
    }

    get width(): typeof this._width {
        return this._width;
    }

    get height(): typeof this._height {
        return this._height;
    }

    restore() {
        moveElements(this._original, this._originalParent!);
    }
}
