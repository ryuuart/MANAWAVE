import { System } from "@ouroboros/anim";
import { Container } from "./container";
import { Item } from "./item";
import { calculateTGridOptions, fillGrid, layoutGrid } from "./layout";
import { simulateItem } from "./simulation";
import { uid } from "@ouroboros/utils/uid";
import Scene from "@ouroboros/dom/scene";
import ContainerComponent from "@ouroboros/dom/components/container";
import ItemComponent from "@ouroboros/dom/components/item";

export default class TickerSystem extends System {
    id: string;

    container: Container<Item>;
    private _sizes: Ticker.Sizes;
    private _properties: Ticker.Properties;

    private _scene: Scene;

    constructor(sizes: Ticker.Sizes, properties: Ticker.Properties) {
        super();

        this.id = uid();

        this.container = new Container();
        this._scene = new Scene();

        this._sizes = structuredClone(sizes);
        this._properties = structuredClone(properties);
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
        // draw the ticker
        let ticker = this._scene.get(this.id);

        // if it doesn't exist, make it
        if (!ticker) {
            ticker = new ContainerComponent(this.id);
            this._scene.set(ticker);
        }

        // remove pass
        for (const component of this._scene.contents) {
            // did we find something?
            const item = this.container.find((i) => i.id === component.id);

            // if we didnt find anything, then
            // the scene has something that shouldnt exist
            if (!item[0]) this._scene.remove(component);
        }

        // go through all container
        for (const item of this.container.contents) {
            let component = this._scene.get(item.id);

            // it hasnt been created yet
            if (!component) {
                component = new ItemComponent(item.id, item);
                ticker.append(component);
            }
        }
    }
}
