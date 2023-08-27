import { Scene } from "@manawave/marquee/scene";
import MarqueeComponent from "./components/marquee";
import { Canvas } from "./canvas";
import Context from "@manawave/marquee/context";
import ItemComponent from "./components/item";

/**
 * Takes in some contexts and provides an environment to
 * continually render a Marquee onto the DOM.
 *
 * @remark {@link Canvas} is here to represent the "pixels" of the Marquee.
 * It represents the live visual state of the Marquee.
 * @see {@link Canvas} for more context on how the actual drawing works.
 */
export class Renderer {
    private canvas: Canvas;

    constructor(context: Context) {
        const template = context.template;
        const root = new MarqueeComponent();
        root.setSize(context.sizes.root);
        root.appendToDOM(context.root);

        this.canvas = new Canvas(root, template, context.pipeline);
    }

    /**
     * Takes a scene and renders it onto the DOM
     * @see {@link Canvas} for context how this is done
     * @param scene scene to render onto the DOM
     */
    render(scene: Scene) {
        this.canvas.draw(scene);
    }

    /**
     * Views all the current item components on the {@link Canvas}
     *
     * @param callback observation hook that allows you to operate on elements if needed
     */
    view(callback: (item: ItemComponent) => void) {
        for (const itemComponent of this.canvas.allItemComponents) {
            callback(itemComponent);
        }
    }
}
