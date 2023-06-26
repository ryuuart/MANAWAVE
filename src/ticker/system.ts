import { System } from "@ouroboros/anim";
import { Scene } from "./scene";
import { Item } from "./item";
import { calculateTGridOptions, fillGrid, layoutGrid } from "./layout";
import { simulateItem } from "./simulation";
import { uid } from "@ouroboros/utils/uid";
import { Renderer } from "@ouroboros/dom/renderer";

export default class TickerSystem extends System {
    id: string;

    scene: Scene<Item>;
    private _renderer: Renderer;

    private _attributes: Ticker.Attributes;

    constructor(context: Ticker.Context) {
        super();

        this.id = uid();

        this.scene = new Scene(context.sizes);
        this._renderer = new Renderer(context);

        this.scene.sizes = context.sizes;
        this._attributes = context.attributes;
    }

    onStart() {
        const gridOptions = calculateTGridOptions(this.scene.sizes);
        fillGrid(this.scene, () => new Item(), gridOptions);
        layoutGrid(this.scene, gridOptions);

        // should perform one draw
        this.onDraw();
    }

    onStop() {
        const gridOptions = calculateTGridOptions(this.scene.sizes);
        layoutGrid(this.scene, gridOptions);
    }

    /**
     * Updates the attributes of the system
     * @param properties new attributes for the system
     */
    updateAttributes(properties: Partial<Ticker.Attributes>) {
        Object.assign(this._attributes, properties);
    }

    /**
     * Updates the size of the ticker and items for future update.
     * @remark This will also add and remove items as needed
     * @param size new size of the Ticker and its Items
     */
    updateSize(size: Partial<Ticker.Sizes>) {
        const prevGridOptions = calculateTGridOptions(this.scene.sizes);

        this.scene.sizes = size;

        const currGridOptions = calculateTGridOptions(this.scene.sizes);

        if (
            prevGridOptions.repetitions.horizontal !==
                currGridOptions.repetitions.horizontal ||
            prevGridOptions.repetitions.vertical !==
                currGridOptions.repetitions.vertical
        ) {
            this.onStart();
        }

        this.onDraw();
    }

    onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
        // iterate through all items
        for (const item of this.scene.contents) {
            simulateItem(item, {
                sizes: this.scene.sizes,
                speed: this._attributes.speed,
                direction: this._attributes.direction,
                dt,
                t,
            });
        }
    }

    onDraw() {
        this._renderer.render(this.scene);
    }
}
