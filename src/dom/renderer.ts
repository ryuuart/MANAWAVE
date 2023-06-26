import { Item } from "@ouroboros/ticker/item";
import { Scene } from "@ouroboros/ticker/scene";
import ItemComponent from "./components/item";
import TickerComponent from "./components/ticker";
import { isRectEqual } from "@ouroboros/utils/rect";

export class Renderer {
    private bufferA: Map<string, ItemComponent>;
    private bufferB: Map<string, ItemComponent>;
    private activeBuffer: Map<string, ItemComponent>;
    private inactiveBuffer: Map<string, ItemComponent>;

    private createQueue: Item[];

    private createBuffer: DocumentFragment;

    private template: DocumentFragment;
    private root: TickerComponent;

    constructor(context: Ticker.Context) {
        this.bufferA = new Map();
        this.bufferB = new Map();

        this.createQueue = [];
        this.createBuffer = document.createDocumentFragment();

        this.activeBuffer = this.bufferA;
        this.inactiveBuffer = this.bufferB;

        this.template = context.dom.template;

        this.root = new TickerComponent();
        this.root.setSize(structuredClone(context.sizes.ticker));
        this.root.appendToDOM(context.dom.root);
    }

    private swapBuffers() {
        if (this.activeBuffer === this.bufferA) {
            this.activeBuffer = this.bufferB;
            this.inactiveBuffer = this.bufferA;
        } else {
            this.activeBuffer = this.bufferA;
            this.inactiveBuffer = this.bufferB;
        }
    }

    private clearDeadComponents() {
        // now lets remove dead items
        for (const [k, v] of this.inactiveBuffer) {
            v.onRemove();
            this.inactiveBuffer.delete(k);
        }
    }

    private createComponents() {
        // now lets create new items
        while (this.createQueue.length > 0) {
            const item = this.createQueue.shift();
            if (item) {
                const component = new ItemComponent(item, this.template);
                component.appendToDOM(this.createBuffer);
                this.activeBuffer.set(component.id, component);
            }
        }
        this.root.append(this.createBuffer);
    }

    render(scene: Scene<Item>) {
        // update ticker size if we need to
        if (!isRectEqual(scene.sizes.ticker, this.root.size))
            this.root.setSize(scene.sizes.ticker);

        for (const item of scene.contents) {
            // if the inactive doesnt have the item, then it's new
            let component = this.inactiveBuffer.get(item.id);
            if (!component) {
                this.createQueue.push(item);
            } else {
                // otherwise, just update it
                if (!isRectEqual(scene.sizes.item, component.size))
                    component.setSize(scene.sizes.item);
                component.setPosition(item.position);

                this.activeBuffer.set(component.id, component);
                this.inactiveBuffer.delete(component.id);
            }
        }

        this.clearDeadComponents();
        this.createComponents();

        this.swapBuffers();
    }
}
