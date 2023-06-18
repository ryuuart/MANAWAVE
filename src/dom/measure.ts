/**
 * Measures something from the DOM including margins
 *
 * @param element HTML element to observe
 * @returns a {@link Rect } with a width and height
 */
export function measureElementBox(
    element: HTMLElement | NodeList | HTMLCollection
): Rect {
    // create a measurement box to contain the margins
    const measureBox = document.createElement("div");
    measureBox.style.display = "inline-block"; // creates a new BFC
    measureBox.style.visibility = "none";

    // if the element is an element, then just add its clone to the box
    if (element instanceof HTMLElement) {
        measureBox.append(element.cloneNode(true));
        if (element.parentElement) element.parentElement.append(measureBox);
        else document.body.append(measureBox);
    } else {
        // otherwise, clone the children and add its clone to the box
        if (element[0].parentElement) {
            measureBox.append(
                ...element[0].parentElement?.cloneNode(true).childNodes
            );
            element[0].parentElement.append(measureBox);
        } else document.body.append(measureBox);
    }

    // calculate the sizes
    const computedStyles = window.getComputedStyle(measureBox);
    const sizes = {
        width: parseFloat(computedStyles["width"]),
        height: parseFloat(computedStyles["height"]),
    };

    measureBox.remove();

    return sizes;
}

/**
 * Measures an HTML Element on the page if it's loaded
 *
 * @param element HTML element to observe
 * @returns a {@link Rect } with a width and height or `null` if the element isn't loaded on the page
 */
export function measure(element: HTMLElement): Rect | null {
    if (element && element.isConnected) {
        const computedStyles = window.getComputedStyle(element);

        return {
            width: parseFloat(computedStyles["width"]),
            height: parseFloat(computedStyles["height"]),
        };
    }
    return null;
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
