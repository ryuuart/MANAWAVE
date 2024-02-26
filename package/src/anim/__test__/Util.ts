export type Position = [number, number];

/**
 * Sets an elements transform position
 * @param element selected element
 * @param position desired position
 */
export function setTranslate(element: Element, position: [number, number]) {
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
 *  Extract a {@link Position} from a matrix string
 *
 * @param matrix a CSS computed transform represented as a matrix
 * @returns a resulting final {@link Position} from the matrix
 */
export function getPositionFromMatrix(matrix: string): Position {
    const parsed = matrix.match(/-?\d+/g)!;

    return [parseFloat(parsed[4]), parseFloat(parsed[5])];
}

/**
 *  Wait for an element to arrive to a position
 * @param element the observed {@link WebdriverIO.Element}
 * @param condition condition for element to arrive to
 * @returns the arrived {@link Position} or none if it never arrived
 */
export async function getPositionUntil(
    element: WebdriverIO.Element,
    condition: (position: Position) => boolean
): Promise<Position | undefined> {
    const result = await browser.waitUntil(async () => {
        const transform = await element.getCSSProperty("transform");
        const position = getPositionFromMatrix(transform.value!);

        if (condition(position)) return position;
    });

    return result;
}
