import { Attributes } from "@ouroboros/dom/attributes";
import { Dimensions, MeasurementBox } from "@ouroboros/dom/measure";

/**
 * Represents the current external, browser-facing state
 * of the internal ticker.
 */
export default class Context {
    private _root: HTMLElement;
    private _mBox: MeasurementBox;
    private _template: DocumentFragment;

    private _sizeObserver: Dimensions;
    private _sizes: LiveSize;
    onSizeUpdate: (size: LiveSize) => void;
    private _attributeObserver: Attributes;
    private _attributes: LiveAttributes;
    onAttrUpdate: (size: LiveAttributes) => void;

    /**
     * Sets up {@link Context} by modifying the selected {@link HTMLElement}
     * to match what a {@link Context} would represent. In other words,
     * it sets up a selected {@link HTMLElement} with its {@link Context}.
     *
     * @param selector selected ticker element to modify
     * @param options options for the ticker
     * @returns a {@link Context} representing this ticker element
     */
    static setup(
        selector: Parameters<Document["querySelector"]>[0] | HTMLElement,
        options: Partial<Ouroboros.Options> = {}
    ): Context {
        let selected;
        if (selector instanceof HTMLElement) selected = selector;
        else selected = document.querySelector<HTMLElement>(selector);

        if (selected) {
            const mBox = new MeasurementBox(...selected.children);
            const template = new DocumentFragment();
            template.append(...selected.children);
            mBox.startMeasuringFrom(selected);

            return new Context(selected, mBox, template, options);
        } else throw new Error("Selected manawave Element not found.");
    }

    constructor(
        root: HTMLElement,
        mBox: MeasurementBox,
        template: DocumentFragment,
        options: Partial<Ouroboros.Options>
    ) {
        this._root = root;
        this._mBox = mBox;
        this._template = template;
        this.onSizeUpdate = () => {};
        this.onAttrUpdate = () => {};

        this._sizeObserver = new Dimensions();
        this._sizeObserver.setEntry("root", this._root, () => {
            this._sizes.update(this._sizeObserver);
            this.onSizeUpdate(this._sizes);
        });
        this._sizeObserver.setEntry("item", this._mBox, () => {
            this._sizes.update(this._sizeObserver);
            this.onSizeUpdate(this._sizes);
        });
        this._sizes = new LiveSize(this._sizeObserver);

        this._attributeObserver = new Attributes(this.root, options);
        this._attributes = new LiveAttributes(this._attributeObserver);
        this._attributeObserver.onUpdate = () => {
            this._attributes.update(this._attributeObserver);
            this.onAttrUpdate(this._attributes);
        };
    }

    get root(): HTMLElement {
        return this._root;
    }

    get template(): Node {
        return this._template.cloneNode(true);
    }

    get sizes(): LiveSize {
        return this._sizes;
    }

    get attributes(): LiveAttributes {
        return this._attributes;
    }

    get itemMBox(): MeasurementBox {
        return this._mBox;
    }
}

/**
 * Data container / reference that should always
 * contain the latest dimension / size values.
 */
export class LiveSize {
    private _root: Rect;
    private _item: Rect;

    constructor(dimensions: Dimensions) {
        this._root = structuredClone(dimensions.get("root"))!;
        this._item = structuredClone(dimensions.get("item"))!;
    }

    /**
     * Updates the dimensions / size values to the latest
     * @param dimensions observer that contains the newest raw dimension values
     */
    update(dimensions: Dimensions) {
        this._root = structuredClone(dimensions.get("root"))!;
        this._item = structuredClone(dimensions.get("item"))!;
    }

    get root(): Rect {
        return this._root;
    }

    get item(): Rect {
        return this._item;
    }
}

/**
 * Data reference / container that should always
 * contain the latest attribute values
 */
export class LiveAttributes {
    private _autoplay: boolean;
    private _speed: number;
    private _direction: number;

    constructor(attributes: Attributes) {
        this._autoplay = attributes.autoplay;
        this._speed = attributes.speed;
        this._direction = attributes.direction;
    }

    /**
     * Updates the attributes to the most recent attributes
     * @param attributes observer that contains the raw, updated attributes
     */
    update(attributes: Attributes) {
        this._autoplay = attributes.autoplay;
        this._speed = attributes.speed;
        this._direction = attributes.direction;
    }

    get autoplay(): boolean {
        return this._autoplay;
    }

    get speed(): number {
        return this._speed;
    }

    get direction(): number {
        return this._direction;
    }
}
