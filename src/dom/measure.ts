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
