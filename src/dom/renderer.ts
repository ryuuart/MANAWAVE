import { Item } from "@ouroboros/ticker/item";
import { Scene } from "@ouroboros/ticker/scene";
import TickerComponent from "./components/ticker";
import { Canvas } from "./canvas";

export class Renderer {
    private canvas: Canvas;

    constructor(context: Ticker.Context) {
        const template = context.dom.template;
        const root = new TickerComponent();
        root.setSize(context.sizes.ticker);
        root.appendToDOM(context.dom.root);

        this.canvas = new Canvas(root, template);
    }

    render(scene: Scene<Item>) {
        this.canvas.draw(scene);
    }
}
