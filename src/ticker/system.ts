import { System } from "@ouroboros/anim";
import { Scene } from "./scene";
import { Simulation } from "./simulation";
import { Renderer } from "@ouroboros/dom/renderer";
import Context from "./context";

export default class TickerSystem extends System {
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
            this._scene
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

    onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
        this._simulation.step(dt, t);
    }

    onDraw() {
        this._renderer.render(this._scene);
    }
}
