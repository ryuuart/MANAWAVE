import { Container } from "./container";

type GridProperties = {
    grid: {
        size: Rect;
    };
    item: {
        size: Rect;
    };
    offset?: vec2;
    repetitions: DirectionalCount;
};

/**
 * Lay out all of a container's items in an uniform grid.
 *
 * @remark we assume that the {@link repetitions} account for uniformity.
 *
 * @param container container that contains items that need to be laid out
 * @param properties description for a grid of items
 */
export function layoutGrid(
    container: Container<Positionable>,
    properties: GridProperties
) {
    const startPos = { x: 0, y: 0 };
    // do we have an offset?
    if (properties.offset) {
        startPos.x = properties.offset.x;
        startPos.y = properties.offset.y;
    }

    // iterate through clones and properly set the positions
    const { repetitions, item } = properties;
    const objects = Array.from(container.contents);
    let objectIndex = 0;
    for (let y = 0; y < repetitions.vertical; y++) {
        for (let x = 0; x < repetitions.horizontal; x++) {
            const currObject = objects[objectIndex];

            currObject.x = startPos.x + x * item.size.width;
            currObject.y = startPos.y + y * item.size.height;

            objectIndex++;
        }
    }
}
