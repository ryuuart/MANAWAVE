import { System } from "@ouroboros/anim";
import { Container, clearContainer } from "./container";
import { Item } from "./item";
import { TickerStateData } from "./state";
import { calculateTGridOptions, fillGrid, layoutGrid } from "./layout";
import { simulateItem } from "./simulation";
import { uid } from "@ouroboros/utils/uid";

export default class TickerSystem extends System implements Listener {
    id: string;
    state: TickerStateData;
    container: Container<Item>;

    constructor(state: TickerStateData) {
        super();

        this.id = uid();

        this.container = new Container();
        this.state = state;

        this.start();
        this.pause();
        if (this.state.autoplay) {
            this.play();
        }
    }

    onStart() {
        const gridOptions = calculateTGridOptions(this.state);
        fillGrid(this.container, () => new Item(), gridOptions);
        layoutGrid(this.container, gridOptions);
    }

    onStop() {
        const gridOptions = calculateTGridOptions(this.state);
        layoutGrid(this.container, gridOptions);
    }

    onMessage(message: string, payload: any) {
        if (message === "update") {
            this.onStateUpdate(payload.curr, payload.prev);
        }
    }

    onStateUpdate(curr: TickerStateData, prev: TickerStateData) {
        // see if the system should update
        const prevGridOptions = calculateTGridOptions(prev);
        const currGridOptions = calculateTGridOptions(curr);

        if (
            prevGridOptions.repetitions.horizontal !==
                currGridOptions.repetitions.horizontal &&
            prevGridOptions.repetitions.vertical !==
                currGridOptions.repetitions.vertical
        ) {
            fillGrid(this.container, () => new Item(), currGridOptions);
            layoutGrid(this.container, currGridOptions);
        }

        this.state = curr;
    }

    onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
        // iterate through all items
        for (const item of this.container.contents) {
            simulateItem(item, { tState: this.state, dt, t });
        }
    }

    onDraw() {}
}
