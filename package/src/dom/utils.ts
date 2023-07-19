/**
 * Updates the size of the Component
 * @param rect new width and height to set
 */
export function setSize(html: HTMLElement, rect: Rect) {
    html.style.width = `${rect.width}px`;
    html.style.height = `${rect.height}px`;
}
