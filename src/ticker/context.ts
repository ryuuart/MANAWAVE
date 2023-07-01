import { convertDirection, mergeOOptions } from "@ouroboros/dom/attributes";
import { Dimensions, MeasurementBox } from "@ouroboros/dom/measure";

/**
 * Represents the current external, browser-facing state
 * of the internal ticker.
 */
export default class Context {
    private _root: HTMLElement;
    private _mBox: MeasurementBox;
    private _template: DocumentFragment;

    private _attributes: Ticker.Attributes;
    private _dimensions: Dimensions;
    private _sizes: LiveSize;

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
        options?: Partial<Ouroboros.Options>
    ): Context {
        let selected;
        if (selector instanceof HTMLElement) selected = selector;
        else selected = document.querySelector<HTMLElement>(selector);

        if (selected) {
            const mBox = new MeasurementBox(...selected.children);
            const currOptions = mergeOOptions(selected, options);
            const template = new DocumentFragment();
            template.append(...selected.children);
            mBox.startMeasuringFrom(selected);

            return new Context(selected, mBox, template, currOptions);
        } else throw new Error("Selected manawave Element not found.");
    }

    constructor(
        root: HTMLElement,
        mBox: MeasurementBox,
        template: DocumentFragment,
        options: Ouroboros.Options
    ) {
        this._root = root;
        this._mBox = mBox;
        this._template = template;

        this._dimensions = new Dimensions();
        this._dimensions.setEntry("root", this._root, (rect: Rect) => {
            this._sizes.root = rect;
        });
        this._dimensions.setEntry("item", this._mBox, (rect: Rect) => {
            this._sizes.item = rect;
        });
        this._sizes = new LiveSize(this._dimensions);

        this._attributes = {
            speed: options.speed,
            direction: convertDirection(options.direction),
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

    get itemMBox(): MeasurementBox {
        return this._mBox;
    }

    get speed(): number {
        return this._attributes.speed;
    }

    set speed(n: number) {
        this._attributes.speed = n;
    }

    get direction(): number {
        return this._attributes.direction;
    }

    set direction(n: number) {
        this._attributes.direction = n;
    }
}

class LiveSize {
    root: Rect;
    item: Rect;

    constructor(dimensions: Dimensions) {
        this.root = structuredClone(dimensions.get("root"))!;
        this.item = structuredClone(dimensions.get("item"))!;
    }
}
