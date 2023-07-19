import { System } from "@manawave/anim";
import { Scene } from "./scene";
import { Simulation } from "./simulation";
import { Renderer } from "@manawave/dom/renderer";
import Context from "./context";
import ItemComponent from "@manawave/dom/components/item";

/**
 * Intersection of the {@link Simulation} and {@link Renderer}. It steps
 * through the simulation and renders the scene. Its
 * purpose is purely to drive and provide context to both
 * the {@link Simulation} and {@link Renderer}.
 */
export default class MWSystem extends System {
    private _scene: Scene;
    private _renderer: Renderer;
    private _simulation: Simulation;

    constructor(context: Context) {
        super();

        this._scene = new Scene();
        this._renderer = new Renderer(context);
        this._simulation = new Simulation(
            context.sizes,
            context.attributes,
            this._scene,
            context.pipeline
        );
    }

    onStart() {
        this._simulation.setup();
        this.onDraw();
    }

    onStop() {
        this._simulation.layout();
    }

    /**
     * Updates the attributes of the system
     * @param attr new attributes for the system
     */
    updateAttributes(attr: Partial<Ticker.Attributes>) {
        this._simulation.updateAttribute(attr);
    }

    /**
     * Updates the size of the ticker and items for future update.
     * @remark This will also add and remove items as needed
     * @param size new size of the Ticker and its Items
     */
    updateSize(size: Partial<Ticker.Sizes>) {
        this._simulation.updateSize(size);
        this.onDraw();
    }

    /**
     * Views current items in ticker
     * @see {@link Renderer} view
     */
    viewItems(callback: (item: ItemComponent) => void) {
        this._renderer.view(callback);
    }

    onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
        this._simulation.step(dt, t);
    }

    onDraw() {
        this._renderer.render(this._scene);
    }
}
