import { expect, vi } from "vitest";

export type Position = [number, number];

/**
 * Sets an elements transform position
 * @param element selected element
 * @param position desired position
 */
export function setTranslate(element: Element, position: Position) {
    const htmlElement = element as HTMLElement;
    htmlElement.style.transform = `translate(${position[0]}px, ${position[1]}px)`;
}

/**
 * Interpolates linearly between 2 values
 * @param v0 start
 * @param v1 end
 * @param t progress between 0 and 1
 * @returns interpolated result
 */
export function lerp(v0: number, v1: number, t: number) {
    return v0 * (1 - t) + v1 * t;
}

/**
 * Reads the translation an element is currently rendered at
 * @param element selected element
 * @returns the rendered {@link Position}
 */
export function positionOf(element: Element): Position {
    const { transform } = getComputedStyle(element);
    const matrix = new DOMMatrixReadOnly(
        transform === "none" ? "" : transform
    );

    return [matrix.m41, matrix.m42];
}

/**
 * Polls an element's rendered position until it satisfies a condition
 * @param element the observed element
 * @param condition condition the element has to arrive at
 * @returns the arrived {@link Position}
 */
export function positionUntil(
    element: Element,
    condition: (position: Position) => boolean
): Promise<Position> {
    return vi.waitFor(
        () => {
            const position = positionOf(element);
            expect(condition(position)).toBe(true);

            return position;
        },
        { timeout: 5000, interval: 16 }
    );
}
