import { wrappedDiv, moveElements, isDOMList } from "../dom";
export default class Template {
    private _originalParent: HTMLElement | null;
    private _original: Parameters<typeof wrappedDiv>[0];

    private _element: HTMLElement;

    constructor(element: Parameters<typeof wrappedDiv>[0]) {
        // Track the original for restoration
        this._original = element;
        if (isDOMList(this._original))
            this._originalParent = this._original[0].parentElement;
        else this._originalParent = this._original.parentElement;

        // Element represents the element to be repeated (the template if you will)
        this._element = wrappedDiv(this._original);
        this._element.classList.add("billboard-template");

        // recover the original after modification, unique hack...
        // what's happening is that the original became the this.element
        this._original = this._element.children;
    }

    get element() {
        return this._element;
    }

    restore() {
        moveElements(this._original, this._originalParent!);
    }
}
