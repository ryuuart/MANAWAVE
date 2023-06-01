import { Container } from "./container";

/**
 * Lay out all of a container's items in an uniform grid.
 *
 * @remark we assume that the {@link repetitions} account for uniformity.
 *
 * @param container container that contains items that need to be laid out
 * @param repetitions the count of items to create horizontally and vertically
 */
export function layoutGrid(
    container: Container<Rect & Positionable>,
    repetitions: RepetitionCount
) {
    // iterate through clones and properly set the positions
    const objects = Array.from(container.contents);
    let objectIndex = 0;
    for (let y = 0; y < repetitions.vertical; y++) {
        for (let x = 0; x < repetitions.horizontal; x++) {
            const currObject = objects[objectIndex];

            currObject.x += x * currObject.width;
            currObject.y += y * currObject.height;

            objectIndex++;
        }
    }
}
