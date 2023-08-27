import { getRepetitions } from "@manawave/dom/measure";
import { angleToDirection } from "./math";
import { Item } from "./item";
import { LiveAttributes, LiveSize } from "./context";
import { Scene } from "./scene";
import { Pipeline } from "./pipeline";

/**
 * Calculates the total repetitions required vertically and horizontally for a marquee. The repetitions are
 * padded by 2 or 1 to account for marquee items that need to loop offscreen.
 *
 * @see {@link getRepetitions } in DOM/measure
 * @param container size of a container of repeatable items
 * @param repeatable repeatable item size
 * @returns the count of repeatable items with 2 or 1 added
 */
function getTRepetitions(container: Rect, repeatable: Rect): DirectionalCount {
    const repetitions = getRepetitions(container, repeatable);
    if (repetitions.horizontal === 0) repetitions.horizontal += 2;
    else repetitions.horizontal += 1;
    if (repetitions.vertical === 0) repetitions.vertical += 2;
    else repetitions.vertical += 1;

    return repetitions;
}

/**
 * Get the limits of a marquee aligned to the size of individual items.
 *
 * @param container size of marquee
 * @param repeatable size of individual item
 * @returns the outer boundaries or edge of the marquee aligned to item sizes
 */
function calcRectLimits(container: Rect, repeatable: Rect): BoundingBox {
    const limits = getRepetitions(container, repeatable);
    const box = {
        left: -repeatable.width,
        right: limits.horizontal * repeatable.width,
        top: -repeatable.height,
        bottom: limits.vertical * repeatable.height,
    };

    return box;
}

/**
 * Represents a simulation that animates items across a rectangle
 * from one end to the opposite end.
 */
export class Simulation {
    private _sizes: LiveSize;
    private _attributes: LiveAttributes;
    private _repetitions: DirectionalCount;
    private _limits: BoundingBox;
    private _intendedDirection: vec2;

    private _scene: Scene;

    private _pipeline: Pipeline;

    constructor(
        sizes: LiveSize,
        attr: LiveAttributes,
        scene: Scene,
        pipeline?: Pipeline
    ) {
        this._scene = scene;
        this._attributes = new LiveAttributes(attr);
        this._sizes = new LiveSize(sizes);

        // initial measurements
        this._repetitions = getTRepetitions(this._sizes.root, this._sizes.item);
        this._limits = calcRectLimits(this._sizes.root, this._sizes.item);
        this._intendedDirection = angleToDirection(this._attributes.direction);

        // use a pipeline if provided
        this._pipeline = !pipeline ? new Pipeline() : pipeline;
    }

    /**
     * Flushes the state of the simulation to a new one, starting at the
     * beginning.
     */
    setup() {
        this._scene.size = this._sizes.root;

        this._repetitions = getTRepetitions(this._sizes.root, this._sizes.item);
        this._limits = calcRectLimits(this._sizes.root, this._sizes.item);
        this._intendedDirection = angleToDirection(this._attributes.direction);

        this._scene.clear();
        this.fill();
        this.layout();
    }

    /**
     * Populates a {@link Scene} with items enough to be laid out in a grid.
     * @remark will remove as needed if overflow
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
        const isItemSync =
            this._scene.length <
            this._repetitions.vertical * this._repetitions.horizontal;
        if (isItemSync)
            throw new Error(
                "The Marquee Simulation is out-of-sync with its size."
            );

        // needs an offset to account for blank space at beginning
        const startPos = {
            x: -this._sizes.item.width,
            y: -this._sizes.item.height,
        };

        // iterate through clones and properly set the positions
        const objects = Array.from(this._scene.contents);
        let objectIndex = 0;
        for (let y = 0; y < this._repetitions.vertical; y++) {
            for (let x = 0; x < this._repetitions.horizontal; x++) {
                // sets the size and position
                const currObject = objects[objectIndex];

                currObject.size = this._sizes.item;

                currObject.position.x = startPos.x + x * this._sizes.item.width;
                currObject.position.y =
                    startPos.y + y * this._sizes.item.height;

                // allow users to customize default behavior
                let userOverride = this._pipeline.onLayout({
                    position: structuredClone(currObject.position),
                    limits: this._sizes.root,
                });
                if (userOverride) {
                    if (userOverride.size) currObject.size = userOverride.size;
                    if (userOverride.position)
                        currObject.position = userOverride.position;
                }

                objectIndex++;
            }
        }
    }

    /**
     * Updates the current simulation attribute
     * @param properties any attribute
     */
    updateAttribute(properties: Partial<Marquee.Attributes>) {
        this._attributes.update(properties);
        this._intendedDirection = angleToDirection(this._attributes.direction);
    }

    /**
     * Updates the current size the simulation
     * @param size new marquee or item size
     */
    updateSize(size: Partial<Marquee.Sizes>) {
        const prev = structuredClone(this._repetitions);

        // propagate the new size
        this._sizes.update(size);
        this._repetitions = getTRepetitions(this._sizes.root, this._sizes.item);

        const curr = this._repetitions;

        // do we need to refill and relayout because there are more items needed now?
        if (
            prev.horizontal !== curr.horizontal ||
            prev.vertical !== curr.vertical
        ) {
            this.setup();
        } else {
            // recalculate
            this._scene.size = this._sizes.root;
            this._limits = calcRectLimits(this._sizes.root, this._sizes.item);

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
            // is there user override info for motion?
            let userOverrideMove = this._pipeline.onMove({
                speed: this._attributes.speed,
                direction: structuredClone(this._attributes.direction),
                dt,
                t,
            });
            // there is so override the default direction
            if (userOverrideMove) {
                if (userOverrideMove.direction !== undefined) {
                    this._intendedDirection = angleToDirection(
                        userOverrideMove.direction
                    );
                }
            }
            // actually move the item
            item.move(this._intendedDirection, this._attributes.speed);

            // is there user override info for looping?
            let userOverrideLoop = this._pipeline.onLoop({
                limits: structuredClone(this._limits),
                itemSize: this._sizes.item,
                marqueeSize: this._sizes.root,
                direction: structuredClone(this._intendedDirection),
            });
            // there is so use the override
            if (userOverrideLoop) {
                if (userOverrideLoop.limits) {
                    item.loop(userOverrideLoop.limits, this._intendedDirection);
                }
            }
            // if the movement caused the item to go out-of-bounds, loop it
            else item.loop(this._limits, this._intendedDirection);

            // gotta update the timestamp
            // this is mostly to propagate time data to things
            // using items and needing time
            item.timestamp.dt = dt;
            item.timestamp.t = t;
        }
    }
}
