import { isRectEqual } from "@ouroboros/utils/rect";
import ItemComponent from "./components/item";
import TickerComponent from "./components/ticker";
import { Item } from "@ouroboros/ticker/item";
import { Scene } from "@ouroboros/ticker/scene";

/**
 * Contains all logic for displaying visual data for a Ticker
 * {@link Scene}. Anything specifically relating to the DOM is managed
 * and stored here.
 */
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

    /**
     * Switches to a clean buffer
     */
    swapBuffer() {
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

    /**
     * Removes dead components designated in the inactive buffer
     */
    clearDeadComponents() {
        // now lets remove dead items
        for (const [k, v] of this.inactiveBuffer) {
            v.onRemove();
            this.inactiveBuffer.delete(k);
        }
    }

    /**
     * Creates new {@link ItemComponent} on the canvas.
     * @param queue list of {@link Item} to render
     */
    createItemComponents(queue: Item[]) {
        // now lets create new items
        for (const item of queue) {
            const component = new ItemComponent(item, this.template);
            component.appendToDOM(this.createBuffer);
            this.activeBuffer.set(component.id, component);
        }
        this.root.appendChildDOM(this.createBuffer);
    }

    /**
     * Updates the root component or Ticker with new data.
     * For now, this is only the size.
     * @param size new size of the root (Ticker)
     */
    updateRootComponent(size: Rect) {
        // update ticker size if we need to
        if (!isRectEqual(size, this.root.size)) {
            this.root.setSize(size);
        }
    }

    /**
     * Takes any {@link ItemComponent} and sets it on the canvas.
     *
     * @remark I use the word "set" to mean that if the {@link ItemComponent}
     * isn't on the {@link Canvas}, then it'll be included. Otherwise,
     * it'll just update the data.
     * @param component specific {@link ItemComponent} to set
     * @param item new data for {@link ItemComponent}
     * @param size new size for {@link ItemComponent}
     */
    setItemComponent(component: ItemComponent, item: Item, size: Rect) {
        if (!isRectEqual(size, component.size)) component.setSize(size);
        component.setPosition(item.position);

        this.activeBuffer.set(component.id, component);
        this.inactiveBuffer.delete(component.id);
    }

    /**
     * Takes a {@link Scene} and translates it to the DOM
     * @param scene description of what to draw
     */
    draw(scene: Scene<Item>) {
        this.updateRootComponent(scene.sizes.ticker);

        const itemQueue = [];
        for (const item of scene.contents) {
            // if the inactive doesnt have the item, then it's new
            let component = this.inactiveBuffer.get(item.id);
            if (!component) {
                itemQueue.push(item);
            } else {
                this.setItemComponent(component, item, scene.sizes.item);
            }
        }

        this.createItemComponents(itemQueue);
        this.swapBuffer();
    }
}
