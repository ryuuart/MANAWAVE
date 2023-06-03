import { System } from "@ouroboros/anim";
import { Container, clearContainer } from "./container";
import { Item } from "./item";
import { TickerState } from "./state";
import { getRepetitions } from "@ouroboros/dom/measure";
import { fillGrid, layoutGrid } from "./layout";
import { simulateItem } from "./simulation";

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
        const state = this.state.current;
        const gridOptions = {
            grid: state.ticker,
            item: state.item,
            repetitions: getTickerRepetitions(
                state.ticker.size,
                state.item.size
            ),
            offset: {
                x: -state.item.size.width,
                y: -state.item.size.height,
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
            simulateItem(item, this.state.current, dt, t);
        }
    }

    onDraw() {}
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
