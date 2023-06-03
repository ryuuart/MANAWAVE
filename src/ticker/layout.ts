import { getRepetitions } from "@ouroboros/dom/measure";
import { Container } from "./container";
import { TickerStateData } from "./state";

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

            currObject.position.x = startPos.x + x * item.size.width;
            currObject.position.y = startPos.y + y * item.size.height;

            objectIndex++;
        }
    }
}

/**
 * Fill a {@link Container} grid with items.
 *
 * @remark for the {@link templateCallback }, make sure to return `new` object references if you do use objects
 * @param container container that contains items that need to be laid out
 * @param templateCallback callback that generates the item to be added
 * @param properties options object that contains the repetitions desired
 */
export function fillGrid(
    container: Container<Positionable>,
    templateCallback: () => Positionable,
    properties: { repetitions: GridProperties["repetitions"] }
) {
    const { repetitions } = properties;
    const totalRepetitions = repetitions.horizontal * repetitions.vertical;

    for (let i = 0; i < totalRepetitions; i++) {
        container.add(templateCallback());
    }
}

/**
 * Calculates the total repetitions required vertically and horizontally for a ticker. The repetitions are
 * padded by 2 to account for ticker items that need to loop offscreen.
 *
 * @see {@link getRepetitions } in DOM/measure
 * @see {@link loopItem } in simulation
 * @param container size of a container of repeatable items
 * @param repeatable repeatable item size
 * @returns the count of repeatable items with 2 extra items added in both directions
 */
function getTRepetitions(container: Rect, repeatable: Rect): DirectionalCount {
    const repetitions = getRepetitions(container, repeatable);
    repetitions.horizontal += 2;
    repetitions.vertical += 2;

    return repetitions;
}

/**
 * Calculates a ticker's grid properties for use in filling and layout.
 *
 * @see {@link fillGrid }
 * @see {@link layoutGrid }
 *
 * @param state the data representation of a ticker's state
 * @returns calculated grid properties for a ticker
 */
export function calculateTGridOptions(state: TickerStateData): GridProperties {
    return {
        grid: state.ticker,
        item: state.item,
        repetitions: getTRepetitions(state.ticker.size, state.item.size),
        offset: {
            x: -state.item.size.width,
            y: -state.item.size.height,
        },
    };
}
