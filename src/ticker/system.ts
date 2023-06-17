import { System } from "@ouroboros/anim";
import { Container } from "./container";
import { Item } from "./item";
import { calculateTGridOptions, fillGrid, layoutGrid } from "./layout";
import { simulateItem } from "./simulation";
import { uid } from "@ouroboros/utils/uid";
import TickerWorld from "@ouroboros/dom/world";

export default class TickerSystem extends System {
    id: string;

    container: Container<Item>;
    private _sizes: Ticker.Sizes;
    private _attributes: Ticker.Attributes;

    private _world: TickerWorld;

    constructor(parentElement: HTMLElement, props: Ticker.Properties) {
        super();

        this.id = uid();

        this.container = new Container();
        this._world = new TickerWorld(parentElement);

        this._sizes = structuredClone(props.sizes);
        this._attributes = structuredClone(props.attributes);
    }

    onStart() {
        const gridOptions = calculateTGridOptions(this._sizes);
        fillGrid(this.container, () => new Item(), gridOptions);
        layoutGrid(this.container, gridOptions);

        // should perform one draw
        this.onDraw();
    }

    onStop() {
        const gridOptions = calculateTGridOptions(this._sizes);
        layoutGrid(this.container, gridOptions);
    }

    updateProperties(properties: Partial<Ticker.Attributes>) {
        Object.assign(this._attributes, properties);
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
                speed: this._attributes.speed,
                direction: this._attributes.direction,
                dt,
                t,
            });
        }
    }

    onDraw() {
        // draw the ticker
        const ticker = this._world.attachTicker(this.id);
        ticker.setSize(this._sizes.ticker);

        // remove pass
        this._world.removeOldItems(this.container);

        // go through all container
        for (const item of this.container.contents) {
            const component = this._world.attachItem(ticker, item);
            component.setSize(this._sizes.item);
            component.setPosition(item.position);
        }

        this._world.attachToRootHTML(ticker);
    }
}
