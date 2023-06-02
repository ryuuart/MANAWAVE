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
