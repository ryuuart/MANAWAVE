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
