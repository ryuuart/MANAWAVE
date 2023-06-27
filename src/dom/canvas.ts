import { isRectEqual } from "@ouroboros/utils/rect";
import ItemComponent from "./components/item";
import TickerComponent from "./components/ticker";
import { Item } from "@ouroboros/ticker/item";
import { Scene } from "@ouroboros/ticker/scene";

export class Canvas {
    private bufferA: Map<string, ItemComponent>;
    private bufferB: Map<string, ItemComponent>;
    private activeBuffer: Map<string, ItemComponent>;
    private inactiveBuffer: Map<string, ItemComponent>;

    private createBuffer: DocumentFragment;
    private template: DocumentFragment;
    private root: TickerComponent;

    constructor(canvas: TickerComponent, initialTemplate: DocumentFragment) {
        this.bufferA = new Map();
        this.bufferB = new Map();

        this.createBuffer = new DocumentFragment();

        this.activeBuffer = this.bufferA;
        this.inactiveBuffer = this.bufferB;

        this.template = initialTemplate;

        this.root = canvas;
    }

    swapBuffers() {
        // make sure the inactive buffer is completely clean!
        this.clearDeadComponents();

        if (this.activeBuffer === this.bufferA) {
            this.activeBuffer = this.bufferB;
            this.inactiveBuffer = this.bufferA;
        } else {
            this.activeBuffer = this.bufferA;
            this.inactiveBuffer = this.bufferB;
        }
    }

    clearDeadComponents() {
        // now lets remove dead items
        for (const [k, v] of this.inactiveBuffer) {
            v.onRemove();
            this.inactiveBuffer.delete(k);
        }
    }

    createComponents(queue: Item[]) {
        // now lets create new items
        for (const item of queue) {
            if (item) {
                const component = new ItemComponent(item, this.template);
                component.appendToDOM(this.createBuffer);
                this.activeBuffer.set(component.id, component);
            }
        }
        this.root.appendChildDOM(this.createBuffer);
    }

    updateRootComponent(size: Rect) {
        // update ticker size if we need to
        if (!isRectEqual(size, this.root.size)) {
            this.root.setSize(size);
        }
    }

    updateItemComponent(component: ItemComponent, item: Item, size: Rect) {
        if (!isRectEqual(size, component.size)) component.setSize(size);
        component.setPosition(item.position);

        this.activeBuffer.set(component.id, component);
        this.inactiveBuffer.delete(component.id);
    }

    draw(scene: Scene<Item>) {
        this.updateRootComponent(scene.sizes.ticker);

        const itemQueue = [];
        for (const item of scene.contents) {
            // if the inactive doesnt have the item, then it's new
            let component = this.inactiveBuffer.get(item.id);
            if (!component) {
                itemQueue.push(item);
            } else {
                this.updateItemComponent(component, item, scene.sizes.item);
            }
        }

        this.createComponents(itemQueue);

        this.swapBuffers();
    }
}
