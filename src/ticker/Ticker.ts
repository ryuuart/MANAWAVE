import { TickerItem } from ".";
import { Template } from "../clones";
import Component from "../web/Component";
import TickerItemFactory from "./TickerItemFactory";

// Represents front-facing Ticker that is rendered
// Logic for placing clones in front-facing ticker should go here
// Logic representing the system should not go here
export default class Ticker {
    private _wrapperElement: HTMLElement;
    private _element: HTMLElement;
    private _height: number; // needed to make the absolute positioning work

    private _initialTemplate: Template | undefined | null; // needed to restore the state of the ticker before start

    constructor(element: HTMLElement) {
        // The main element that contains anything relating to Billboard
        this._wrapperElement = element;

        // Billboard-ticker refers to what represents the entire Billboard-ticker itself
        this._element = document.createElement("div");
        this._element.classList.add("billboard-ticker-container");

        this._height = this._wrapperElement.offsetHeight;
        this._element.style.minHeight = `${this._height}px`;
    }

    get isRendered(): boolean {
        return this._wrapperElement.contains(this._element);
    }

    get initialTemplate() {
        return this._initialTemplate;
    }

    get dimensions(): Dimensions {
        return {
            width: this._element.offsetWidth,
            height: this._element.offsetHeight,
        };
    }

    get height() {
        return this._height;
    }

    set height(height: number) {
        this._height = height;

        if (this._wrapperElement.offsetHeight > this._height) {
            this._height = this._wrapperElement.offsetHeight;
        }

        this._element.style.minHeight = `${this._height}px`;
    }

    load() {
        if (!(this._wrapperElement instanceof Component)) {
            this._wrapperElement.classList.add("billboard-ticker");
        }

        this._initialTemplate = new Template(this._wrapperElement.children);
        this._wrapperElement.append(this._element);
    }

    unload() {
        if (this._initialTemplate != undefined) {
            this._initialTemplate.restore();
            this._initialTemplate = null;
        }
        if (this._element != undefined) {
            this._element.remove();
        }
        if (this._wrapperElement != undefined) {
            this._wrapperElement.classList.remove("billboard-ticker");
        }
    }

    // Add in a lil element but if it's a lil too big, then the ticker needs to resize
    // [TODO] figure out responsiveness part
    // might need to remove this part if someone already gave it a height that's less
    // than any other height :/
    append(item: TickerItem) {
        const { height: itemHeight } = item.dimensions;

        item.appendTo(this._element);

        if (itemHeight > this._height) {
            this._height = itemHeight;
            this._element.style.minHeight = `${this._height}px`;
        }
    }
}
