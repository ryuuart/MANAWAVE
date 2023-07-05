import { getRepetitions } from "@ouroboros/dom/measure";
import { accumulateVec2, angleToDirection } from "./math";
import { Item } from "./item";
import { LiveAttributes, LiveSize } from "./context";
import { Scene } from "./scene";

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
 * Get the limits of a ticker aligned to the size of individual items.
 *
 * @param ticker size of ticker
 * @param item size of individual item
 * @returns the outer boundaries or edge of the ticker aligned to item sizes
 */
function getTLimits(ticker: Rect, item: Rect): DirectionalCount {
    const limits = getRepetitions(ticker, item);
    limits.horizontal *= item.width;
    limits.vertical *= item.height;

    return limits;
}

/**
 * Creates an accumulator that reduces or sums directional changes over time. In other words, it
 * creates a function that allows you to sum directional differences throughout your code. You get
 * the latest result with each function call, and it allows you to operate on this logic continually.
 *
 * @returns a function that accumulates directional changes
 */
function makeDirectionAccumulator() {
    const accumulate = accumulateVec2({ x: 0, y: 0 });

    /**
     * Calculates the difference between positions to create a direction.
     * This function will sum this difference with all previous directional differences.
     *
     * @param prevPos the start or previous position
     * @param currPos the affected or new position
     */
    return function (prevPos: vec2, currPos: vec2): vec2 {
        const delta = { x: currPos.x - prevPos.x, y: currPos.y - prevPos.y };
        return accumulate(delta);
    };
}

export class Simulation {
    private _sizes: LiveSize;
    private _attributes: LiveAttributes;
    private _repetitions: DirectionalCount;
    private _limits: DirectionalCount;
    private _intendedDirection: vec2;

    private _scene: Scene;

    constructor(sizes: LiveSize, attr: LiveAttributes, scene: Scene) {
        this._scene = scene;
        this._attributes = new LiveAttributes(attr);
        this._sizes = new LiveSize(sizes);

        this._repetitions = getTRepetitions(this._sizes.root, this._sizes.item);
        this._limits = getTLimits(this._sizes.root, this._sizes.item);
        this._intendedDirection = angleToDirection(this._attributes.direction);
    }

    /**
     * Flushes the state of the simulation to a new one, starting at the
     * beginning.
     */
    setup() {
        this._scene.size = this._sizes.root;

        this._repetitions = getTRepetitions(this._sizes.root, this._sizes.item);
        this._limits = getTLimits(this._sizes.root, this._sizes.item);
        this._intendedDirection = angleToDirection(this._attributes.direction);

        this._scene.clear();
        this.fill();
        this.layout();
    }

    /**
     * Populates a {@link Scene} with items enough to be laid out in a grid.
     * @see {@link layout}
     */
    fill() {
        const nTemplatesToGenerate =
            this._repetitions.horizontal * this._repetitions.vertical -
            this._scene.length;

        if (nTemplatesToGenerate > 0)
            for (let i = 0; i < nTemplatesToGenerate; i++) {
                this._scene.add(new Item(undefined, this._sizes.item));
            }
        else if (nTemplatesToGenerate < 0) {
            for (let i = 0; i < Math.abs(nTemplatesToGenerate); i++) {
                this._scene.delete(this._scene.find(() => true)[0]);
            }
        }
    }

    /**
     * Positions all items in a {@link Scene} according to a grid layout.
     * Needs to be filled with the proper amount of items.
     * @see {@link fill}
     */
    layout() {
        if (
            this._scene.length <
            this._repetitions.vertical * this._repetitions.horizontal
        )
            throw new Error(
                "The Ticker Simulation is out-of-sync with its size."
            );

        const startPos = {
            x: -this._sizes.item.width,
            y: -this._sizes.item.height,
        };

        // iterate through clones and properly set the positions
        const objects = Array.from(this._scene.contents);
        let objectIndex = 0;
        for (let y = 0; y < this._repetitions.vertical; y++) {
            for (let x = 0; x < this._repetitions.horizontal; x++) {
                const currObject = objects[objectIndex];

                currObject.size = this._sizes.item;

                currObject.position.x = startPos.x + x * this._sizes.item.width;
                currObject.position.y =
                    startPos.y + y * this._sizes.item.height;

                objectIndex++;
            }
        }
    }

    /**
     * Updates the current simulation attribute
     * @param properties any attribute
     */
    updateAttribute(properties: Partial<Ticker.Attributes>) {
        this._attributes.update(properties);
        this._intendedDirection = angleToDirection(this._attributes.direction);
    }

    /**
     * Updates the current size the simulation
     * @param size new ticker or item size
     */
    updateSize(size: Partial<Ticker.Sizes>) {
        const prev = structuredClone(this._repetitions);

        this._sizes.update(size);
        this._repetitions = getTRepetitions(this._sizes.root, this._sizes.item);
        const curr = this._repetitions;

        if (
            prev.horizontal !== curr.horizontal ||
            prev.vertical !== curr.vertical
        ) {
            this.setup();
        } else {
            this._scene.size = this._sizes.root;
            this._limits = getTLimits(this._sizes.root, this._sizes.item);

            // only the item size needs to be updated
            for (const item of this._scene.contents) {
                item.size = this._sizes.item;
            }
        }
    }

    /**
     * Step through the simulation and update its overall state.
     * @param dt time between steps
     * @param t total elapsed time
     */
    step(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
        for (const item of this._scene.contents) {
            // start measuring changes in actual direction
            const accumulateDirection = makeDirectionAccumulator();
            const initialPosition = item.position;
            let actualDirection = { x: 0, y: 0 };

            // override

            // measure a directional change if the override induced a
            // change in direction
            actualDirection = accumulateDirection(
                initialPosition,
                item.position
            );

            // actually move the item
            item.move(this._intendedDirection, this._attributes.speed);

            // measure a directional change from the recent movement
            actualDirection = accumulateDirection(
                actualDirection,
                item.position
            );

            // if the movement caused the item to go out-of-bounds, loop it
            item.loop(this._limits, actualDirection);

            // age the item
            item.lifetime += dt;
        }
    }
}
