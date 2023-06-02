import { System } from "@ouroboros/anim";
import { Container, clearContainer } from "./container";
import { Item } from "./item";
import TickerState from "./state";
import { getRepetitions } from "@ouroboros/dom/measure";
import { fillGrid, layoutGrid } from "./layout";
import { accumulateVec2, normalize, toRadians } from "./math";

type ItemState = {
    direction: vec2;
    position: vec2;
    speed: number;
    time: { dt: DOMHighResTimeStamp; t: DOMHighResTimeStamp };
};

export default class TickerSystem extends System {
    state: TickerState;
    container: Container<Item>;

    constructor(state: TickerState) {
        super();

        this.container = new Container();
        this.state = state;

        // decided TickerSystem should start the system
        // because data-driven design reflects the data
        if (this.state.current.autoplay) {
            this.start();
        }
    }

    onStart() {
        const gridOptions = {
            grid: this.state.current.ticker,
            item: this.state.current.item,
            repetitions: getTickerRepetitions(
                this.state.current.ticker.size,
                this.state.current.item.size
            ),
            offset: {
                x: -this.state.current.item.size.width,
                y: -this.state.current.item.size.height,
            },
        };

        fillGrid(this.container, () => new Item(), gridOptions);
        layoutGrid(this.container, gridOptions);
    }

    onStop() {
        clearContainer(this.container);
    }

    onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
        // iterate through all items
        for (const item of this.container.contents) {
            item.lifetime += dt;

            // precalculate and store modified state inside another state object
            let itemState = getItemState(item, this.state, { dt, t });

            const accumulateDirection = makeDirectionAccumulator();
            const initialPosition = structuredClone(itemState.position);

            // TODO: add an override hook
            // if (this._onItemUpdated) {
            //     Object.assign(itemState, this._onItemUpdated(itemState));
            // }

            // there's a direction we want, and one that is actually happening
            // useful when there's custom logic that overrides the theoretical / intended direction
            const initialDirection = accumulateDirection(
                initialPosition,
                itemState.position
            );

            // perform modification
            solveItemMotion(item, itemState);

            const finalDirection = accumulateDirection(initialDirection, {
                x: item.x,
                y: item.y,
            });

            // test and set where items should loop once out of bounds
            loopItem(item, finalDirection, this.state);
        }
    }

    onDraw() {}
}

function getTickerLimits(state: TickerState): DirectionalCount {
    const tickerSize = state.current.ticker.size;
    const itemSize = state.current.item.size;

    const limits = getRepetitions(tickerSize, itemSize);
    limits.horizontal *= itemSize.width;
    limits.vertical *= itemSize.height;

    return limits;
}

function getItemState(
    item: Item,
    state: TickerState,
    time: { t: DOMHighResTimeStamp; dt: DOMHighResTimeStamp }
): ItemState {
    return {
        direction: {
            x: Math.cos(toRadians(state.current.direction)),
            y: Math.sin(toRadians(state.current.direction)),
        },
        position: {
            x: item.x,
            y: item.y,
        },
        speed: state.current.speed,
        time,
    };
}

function loopItem(item: Item, finalDirection: vec2, state: TickerState) {
    const tickerSize = state.current.ticker.size;
    const itemSize = state.current.item.size;
    const limits = getTickerLimits(state);

    if (finalDirection.x > 0 && item.x >= limits.horizontal) {
        item.x = -itemSize.width;
    } else if (finalDirection.x < 0 && item.x <= -itemSize.width) {
        item.x = limits.horizontal;
    }
    if (finalDirection.y > 0 && item.y >= limits.vertical) {
        item.y = -itemSize.height;
    } else if (finalDirection.y < 0 && item.y <= -itemSize.height) {
        item.y = limits.vertical;
    }
}

function makeDirectionAccumulator() {
    const accumulate = accumulateVec2({ x: 0, y: 0 });

    return function (prevPos: vec2, currPos: vec2): vec2 {
        const delta = { x: currPos.x - prevPos.x, y: currPos.y - prevPos.y };
        return accumulate(delta);
    };
}

function getTickerRepetitions(
    container: Rect,
    repeatable: Rect
): DirectionalCount {
    const repetitions = getRepetitions(container, repeatable);
    repetitions.horizontal += 2;
    repetitions.vertical += 2;

    return repetitions;
}

function solveItemMotion(item: Item, state: ItemState) {
    // directions should not have any magnitude and should be normalized
    const normalizedDirection = normalize(state.direction);

    item.x = state.position.x + 1 * state.speed * normalizedDirection.x;
    item.y = state.position.y + 1 * state.speed * normalizedDirection.y;
}
