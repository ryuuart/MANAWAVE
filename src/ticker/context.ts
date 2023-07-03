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
        this._sizeObserver.setEntry("root", this._root, (rect: Rect) => {
            this._sizes.update({ root: rect });
            this.onSizeUpdate(this._sizes);
        });
        this._sizeObserver.setEntry("item", this._mBox, (rect: Rect) => {
            this._sizes.update({ item: rect });
            this.onSizeUpdate(this._sizes);
        });
        this._sizes = new LiveSize({
            root: this._sizeObserver.get("root")!,
            item: this._sizeObserver.get("item")!,
        });

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

    constructor(initial: Partial<{ root: Rect; item: Rect }> = {}) {
        this._root = { width: 0, height: 0 };
        this._item = { width: 0, height: 0 };

        const { root, item } = initial;
        if (root) this._root = root;
        if (item) this._item = item;
    }

    /**
     * Updates the dimensions / size values to the latest
     * @param payload new data to update
     */
    update(payload: Partial<{ root: Rect; item: Rect }>) {
        const { root, item } = payload;
        if (root) this._root = root;
        if (item) this._item = item;
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

    constructor(
        initial: Partial<{
            autoplay: boolean;
            speed: number;
            direction: number;
        }> = {}
    ) {
        this._autoplay = false;
        this._speed = 1;
        this._direction = 0;

        const { autoplay, speed, direction } = initial;
        if (autoplay) this._autoplay = autoplay;
        if (speed) this._speed = speed;
        if (direction) this._direction = direction;
    }

    /**
     * Updates the attributes to the most recent attributes
     * @param payload new data to update
     */
    update(
        payload: Partial<{
            autoplay: boolean;
            speed: number;
            direction: number;
        }>
    ) {
        const { autoplay, speed, direction } = payload;
        if (autoplay) this._autoplay = autoplay;
        if (speed) this._speed = speed;
        if (direction) this._direction = direction;
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
