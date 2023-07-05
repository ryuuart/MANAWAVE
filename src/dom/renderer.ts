import { Item } from "@ouroboros/ticker/item";
import { Scene } from "@ouroboros/ticker/scene";
import TickerComponent from "./components/ticker";
import { Canvas } from "./canvas";
import Context from "@ouroboros/ticker/context";

/**
 * Takes in some contexts and provides an environment to
 * continually render a Ticker onto the DOM.
 *
 * @remark {@link Canvas} is here to represent the "pixels" of the Ticker.
 * It represents the live visual state of the Ticker.
 * @see {@link Canvas} for more context on how the actual drawing works.
 */
export class Renderer {
    private canvas: Canvas;

    constructor(context: Context) {
        const template = context.template;
        const root = new TickerComponent();
        root.setSize(context.sizes.root);
        root.appendToDOM(context.root);

        this.canvas = new Canvas(root, template);
    }

    /**
     * Takes a scene and renders it onto the DOM
     * @see {@link Canvas} for context how this is done
     * @param scene scene to render onto the DOM
     */
    render(scene: Scene<Item>) {
        this.canvas.draw(scene);
    }
}
