import { Attributes } from "@manawave/dom/attributes";
import WebComponent from "@manawave/dom/element";
import { Dimensions, MeasurementBox } from "@manawave/dom/measure";
import styles from "../dom/styles/manawave.module.css";
import { debounce } from "@manawave/utils/debounce";
import { Pipeline } from "./pipeline";

/**
 * Represents the current external, browser-facing state
 * of the internal marquee.
 */
export default class Context {
    // stuff in the dom to keep on using
    private _root: HTMLElement;
    private _mBox: MeasurementBox;
    private _template: DocumentFragment;

    // values to keep updated from the dom
    private _sizeObserver: Dimensions;
    private _sizes: LiveSize;
    onSizeUpdate: (size: LiveSize) => void;
    private _attributeObserver: Attributes;
    private _attributes: LiveAttributes;
    onAttrUpdate: (size: LiveAttributes) => void;

    // hooks to override default behavior
    private _pipeline: Pipeline;

    /**
     * Sets up {@link Context} by modifying the selected {@link HTMLElement}
     * to match what a {@link Context} would represent. In other words,
     * it sets up a selected {@link HTMLElement} with its {@link Context}.
     *
     * @param selector selected marquee element to modify
     * @param options options for the marquee
     * @returns a {@link Context} representing this marquee element
     */
    static setup(
        selector: Parameters<Document["querySelector"]>[0] | HTMLElement,
        options: Partial<manawave.Options> = {}
    ): Context {
        // try to find it
        let selected;
        if (selector instanceof HTMLElement) selected = selector;
        else selected = document.querySelector<HTMLElement>(selector);

        if (selected) {
            if (selected.childElementCount <= 0)
                throw new Error(
                    "It looks like there is nothing inside the marquee. A marquee needs at least one element inside to do anything."
                );

            // if it's not a web component, then it needs some basic styling
            if (!(selected instanceof WebComponent))
                selected.classList.add(styles.manawaveRoot);

            // add a11y labeling
            selected.role = "marquee";
            if (
                !selected.ariaLabel &&
                !selected.hasAttribute("aria-labelledby")
            ) {
                selected.ariaLabel = "marquee";
            }

            // WARNING IT HAS TO BE IN THIS SPECIFIC ORDER DO NOT CHANGE
            // basically, it first boxes the repeating items to be measured over time
            // then it removes them from the dom and places it inside a template to clone from
            // then it adds a measurement box to the dom to be measured over time
            const mBox = new MeasurementBox(...selected.children);
            const template = new DocumentFragment();
            template.append(...selected.children);
            mBox.startMeasuringFrom(selected);

            // store results to use and propagate
            return new Context(selected, mBox, template, options);
        } else throw new Error("Selected manawave Element not found.");
    }

    constructor(
        root: HTMLElement,
        mBox: MeasurementBox,
        template: DocumentFragment,
        options: Partial<manawave.Options>
    ) {
        // set defaults
        this._root = root;
        this._mBox = mBox;
        this._template = template;
        this.onSizeUpdate = () => {};
        this.onAttrUpdate = () => {};

        // start propagating size changes
        this._sizeObserver = new Dimensions();
        this._sizeObserver.setEntry(
            "root",
            this._root,
            debounce((rect: Rect) => {
                this._sizes.update({ root: rect });
                this.onSizeUpdate(this._sizes);
            }, 150)
        );
        this._sizeObserver.setEntry(
            "item",
            this._mBox,
            debounce((rect: Rect) => {
                this._sizes.update({ item: rect });
                this.onSizeUpdate(this._sizes);
            }, 150)
        );
        this._sizes = new LiveSize({
            root: this._sizeObserver.get("root")!,
            item: this._sizeObserver.get("item")!,
        });

        // start propagating attribute changes
        this._attributeObserver = new Attributes(this.root, options);
        this._attributes = new LiveAttributes(this._attributeObserver);
        this._attributeObserver.onUpdate = () => {
            this._attributes.update(this._attributeObserver);
            this.onAttrUpdate(this._attributes);
        };

        // set main pipeline for entire system
        this._pipeline = new Pipeline();
        this._pipeline.onElementCreated =
            options.onElementCreated ?? (() => {});
        this._pipeline.onElementDestroyed =
            options.onElementDestroyed ?? (() => {});
        this._pipeline.onElementDraw = options.onElementDraw ?? (() => {});
        this._pipeline.onLayout = options.onLayout ?? (() => {});
        this._pipeline.onLoop = options.onLoop ?? (() => {});
        this._pipeline.onMove = options.onMove ?? (() => {});
    }

    /**
     * Propagate new attribute values throughout the system
     */
    set attributes(
        attr: Partial<{ speed: number; direction: number; autoplay: boolean }>
    ) {
        this._attributeObserver.update(attr);
    }

    /**
     * @returns the containing DOM element for the entire marquee
     */
    get root(): HTMLElement {
        return this._root;
    }

    /**
     * @returns a template to clone repeating items
     */
    get template(): DocumentFragment {
        return this._template.cloneNode(true) as DocumentFragment;
    }

    /**
     * @returns a snapshot of the current sizes of the system
     */
    get sizes(): LiveSize {
        return this._sizes;
    }

    /**
     * @returns a snapshot of the current attributes of the system
     */
    get attributes(): LiveAttributes {
        return this._attributes;
    }

    /**
     * @returns the object and element used to measure the repeating items
     */
    get itemMBox(): MeasurementBox {
        return this._mBox;
    }

    /**
     * @returns the set of hooks used to customize behavior throughout the system
     */
    get pipeline(): Pipeline {
        return this._pipeline;
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

        // override if necessary
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

    /**
     * @returns the size of the root container element
     */
    get root(): Rect {
        return structuredClone(this._root);
    }

    /**
     * @returns the size of the repeating item element
     */
    get item(): Rect {
        return structuredClone(this._item);
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

        // override if needed
        const { autoplay, speed, direction } = initial;
        if (autoplay !== undefined) this._autoplay = autoplay;
        if (speed !== undefined) this._speed = speed;
        if (direction !== undefined) this._direction = direction;
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
        if (autoplay !== undefined) this._autoplay = autoplay;
        if (speed !== undefined) this._speed = speed;
        if (direction !== undefined) this._direction = direction;
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
