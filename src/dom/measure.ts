/**
 * Creates a box to measure a list or single element in, including margins
 */
export class MeasurementBox {
    private box: HTMLElement;

    constructor(...elements: Element[]) {
        this.box = document.createElement("div");
        this.box.style.display = "inline-block"; // creates a BFC (to measure margins)
        this.box.style.visibility = "hidden";

        this.box.append(...elements.map((e) => e.cloneNode(true)));
    }

    /**
     * Returns the current measurement of the Box.
     * @remark returns a 0 Rect if it's not on the page or not measuring
     * @returns a Rect representing the current size of the box
     */
    get measurement(): Rect {
        const measurement = measure(this.box);
        return measurement;
    }

    /**
     * Returns the DOM element representation of this box
     */
    get element(): HTMLElement {
        return this.box;
    }

    /**
     * Places the box and allows it to be measured
     * @param parent where the box should be
     */
    startMeasuringFrom(parent: HTMLElement) {
        parent.append(this.box);
    }

    /**
     * Removes the box from the DOM, stopping measurement.
     */
    stopMeasuring() {
        this.box.remove();
    }
}

type DimensionEntry = {
    onChange?: (rect: Rect) => void;
    rect: Rect;
};

/**
 * Keeps track of dimensions in the DOM
 */
export class Dimensions {
    private observer: ResizeObserver;
    private dimensions: Map<string, DimensionEntry>;
    private targets: Map<Element, string>;

    constructor() {
        this.dimensions = new Map();
        this.targets = new Map();
        this.observer = new ResizeObserver(this.onResize.bind(this));
    }

    /**
     * Fetches the dimensions of an entry
     * @param name name of an assigned dimension
     * @returns assigned dimension or size
     */
    get(name: string): Rect | undefined {
        return this.dimensions.get(name)?.rect;
    }

    /**
     * Adds a new entry to observe the dimensions of something
     * @param name name of entry
     * @param box representation of something that has a dimension
     * @param resizeHandler handles what to do in event of a resize
     */
    setEntry(
        name: string,
        box: HTMLElement | MeasurementBox,
        resizeHandler?: (rect: Rect) => void
    ) {
        let element: HTMLElement;
        let initialRect: Rect;
        if (box instanceof HTMLElement) {
            element = box;
            initialRect = measure(box);
        } else {
            element = box.element;
            initialRect = box.measurement;
        }

        this.targets.set(element, name);
        this.dimensions.set(name, {
            rect: initialRect,
            onChange: resizeHandler,
        });
        this.observer.observe(element);
    }

    /**
     * Collects the new dimensions of everything when a resize happens so information can be propagated.
     * @param entries all the elements being observed in a resize event
     */
    private onResize(entries: ResizeObserverEntry[]) {
        for (const entry of entries) {
            const name = this.targets.get(entry.target);
            if (name) {
                const dEntry = this.dimensions.get(name);

                if (dEntry) {
                    const newSize = {
                        width: entry.borderBoxSize[0].inlineSize,
                        height: entry.borderBoxSize[0].blockSize,
                    };

                    dEntry.rect.width = newSize.width;
                    dEntry.rect.height = newSize.height;

                    if (dEntry.onChange) dEntry.onChange(newSize);
                }
            }
        }
    }
}

/**
 * Measures an HTML Element on the page if it's loaded
 *
 * @param element HTML element to observe
 * @returns a {@link Rect } with a width and height or `null` if the element isn't loaded on the page
 */
export function measure(element: HTMLElement): Rect {
    const measurement = { width: 0, height: 0 };
    if (element && element.isConnected) {
        measurement.width = element.clientWidth;
        measurement.height = element.clientHeight;
    }

    return measurement;
}

/**
 * Takes objects with width and height and counts how many times an inner object can repeat in an outer.
 *
 * @remark Repetitions **includes** the repeatable object in its final count.
 *
 * @param container bounds for the repeating object to measure against
 * @param repeatable the repeating object
 * @returns a count for how many times a repeating object repeats against its container
 */
export function getRepetitions(
    container: Rect,
    repeatable: Rect
): DirectionalCount {
    return {
        horizontal: Math.ceil(container.width / repeatable.width),
        vertical: Math.ceil(container.height / repeatable.height),
    };
}
