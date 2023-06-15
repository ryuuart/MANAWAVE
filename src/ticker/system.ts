import { System } from "@ouroboros/anim";
import { Container } from "./container";
import { Item } from "./item";
import { calculateTGridOptions, fillGrid, layoutGrid } from "./layout";
import { simulateItem } from "./simulation";
import { uid } from "@ouroboros/utils/uid";

export default class TickerSystem extends System {
    id: string;

    // TODO: will have a way to output state of system
    container: Container<Item>;
    private _sizes: Ticker.Sizes;
    private _properties: Ticker.Properties;
    private _frameData: Ticker.FrameData;

    constructor(sizes: Ticker.Sizes, properties: Ticker.Properties) {
        super();

        this.id = uid();

        this.container = new Container();
        this._sizes = structuredClone(sizes);
        this._properties = structuredClone(properties);
        this._frameData = { items: {} };
    }

    get currentFrameData(): Ticker.FrameData {
        return structuredClone(this._frameData);
    }

    onStart() {
        const gridOptions = calculateTGridOptions(this._sizes);
        this._frameData.items = {};
        fillGrid(this.container, () => new Item(), gridOptions);
        layoutGrid(this.container, gridOptions);

        // should perform one draw
        this.onDraw();
    }

    onStop() {
        const gridOptions = calculateTGridOptions(this._sizes);
        layoutGrid(this.container, gridOptions);
    }

    updateProperties(properties: Partial<Ticker.Properties>) {
        Object.assign(this._properties, properties);
    }

    updateSize(size: Partial<Ticker.Sizes>) {
        const prevGridOptions = calculateTGridOptions(this._sizes);

        Object.assign(this._sizes, size);

        const currGridOptions = calculateTGridOptions(this._sizes);

        if (
            prevGridOptions.repetitions.horizontal !==
                currGridOptions.repetitions.horizontal &&
            prevGridOptions.repetitions.vertical !==
                currGridOptions.repetitions.vertical
        ) {
            this.onStart();
        }
    }

    onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
        // iterate through all items
        for (const item of this.container.contents) {
            simulateItem(item, {
                sizes: this._sizes,
                speed: this._properties.speed,
                direction: this._properties.direction,
                dt,
                t,
            });
        }
    }

    onDraw() {
        for (const item of this.container.contents) {
            this._frameData.items[item.id] = item.position;
        }
    }
}
