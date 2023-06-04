import { System } from "@ouroboros/anim";
import { Container, clearContainer } from "./container";
import { Item } from "./item";
import { TickerState } from "./state";
import { calculateTGridOptions, fillGrid, layoutGrid } from "./layout";
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
        const gridOptions = calculateTGridOptions(this.state.current);
        fillGrid(this.container, () => new Item(), gridOptions);
        layoutGrid(this.container, gridOptions);
    }

    onStop() {
        clearContainer(this.container);
    }

    onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
        // see if the system should update
        const prevGridOptions = calculateTGridOptions(this.state.previous);
        const currGridOptions = calculateTGridOptions(this.state.current);

        if (
            prevGridOptions.repetitions.horizontal !==
                currGridOptions.repetitions.horizontal &&
            prevGridOptions.repetitions.vertical !==
                currGridOptions.repetitions.vertical
        ) {
            fillGrid(this.container, () => new Item(), currGridOptions);
            layoutGrid(this.container, currGridOptions);
        }

        // iterate through all items
        for (const item of this.container.contents) {
            simulateItem(item, { tState: this.state.current, dt, t });
        }
    }

    onDraw() {}
}
