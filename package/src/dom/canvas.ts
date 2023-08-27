import { Pipeline } from "../marquee/pipeline";
import { isRectEqual } from "@manawave/utils/rect";
import ItemComponent from "./components/item";
import MarqueeComponent from "./components/marquee";
import { Item } from "@manawave/marquee/item";
import { Scene } from "@manawave/marquee/scene";

/**
 * Contains all logic for displaying visual data for a Marquee
 * {@link Scene}. Anything specifically relating to the DOM is managed
 * and stored here.
 *
 * It uses a 2-buffer system. The idea is to always draw on a blank canvas, so I use
 * 2 buffers to simulate this. You can't really repeatedly draw on an HTML document
 * by recreating DOM nodes and drawing them. The performance would be terrifying to say the least.
 *
 * What I do is basically on each draw, "draw" or write to an active buffer and invalidate the previous buffer.
 * Any DOM nodes that need to be created will be created and any that already exist will just move from
 * the inactive buffer to the active one. This is what simulates a "draw".
 *
 * Anything that's dead as in there's not really a reference to it gets removed.
 *
 * It's similar to using an object pool as a pixels to draw on a buffer. That's my mindset here. I hoped that
 * by using a bunch of maps, I'm seriously saving in terms of time complexity for a bit more of space. The main problem
 * this is solving is to batch DOM operations and perform in bursts.
 */
export class Canvas {
    private bufferA: Map<string, ItemComponent>;
    private bufferB: Map<string, ItemComponent>;
    private activeBuffer: Map<string, ItemComponent>;
    private inactiveBuffer: Map<string, ItemComponent>;

    private createBuffer: DocumentFragment;
    private template: DocumentFragment;
    private root: MarqueeComponent;

    private _pipeline: Pipeline;

    constructor(
        canvas: MarqueeComponent,
        initialTemplate: DocumentFragment,
        pipeline?: Pipeline
    ) {
        this.bufferA = new Map();
        this.bufferB = new Map();

        this.createBuffer = new DocumentFragment();

        this.activeBuffer = this.bufferA;
        this.inactiveBuffer = this.bufferB;

        this.template = initialTemplate;

        this.root = canvas;

        if (pipeline) this._pipeline = pipeline;
        else this._pipeline = new Pipeline();
    }

    /**Get any component that is currently on screen */
    get allItemComponents(): ItemComponent[] {
        return Array.from(this.inactiveBuffer.values());
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

            this._pipeline.onElementDestroyed({ element: v.element, id: v.id });

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

            const userOverride = this._pipeline.onElementCreated({
                id: component.id,
                element: component.element,
            });
            if (userOverride) {
                if (userOverride.element) {
                    component.element = userOverride.element;
                }
            }

            component.appendToDOM(this.createBuffer);
            this.activeBuffer.set(component.id, component);

            this._pipeline.onElementDraw({
                element: component.element,
                id: component.id,
                dt: item.timestamp.dt,
                t: item.timestamp.t,
            });
        }
        this.root.appendChildDOM(this.createBuffer);
    }

    /**
     * Updates the root component or Marquee with new data.
     * For now, this is only the size.
     * @param size new size of the root (Marquee)
     */
    updateRootComponent(size: Rect) {
        // update marquee size if we need to
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
    setItemComponent(component: ItemComponent, item: Item) {
        if (!isRectEqual(item.size, component.size))
            component.setSize(item.size);
        component.setPosition(item.position);

        this._pipeline.onElementDraw({
            element: component.element,
            id: component.id,
            dt: item.timestamp.dt,
            t: item.timestamp.t,
        });

        // "draw" the item by moving it to the active buffer
        this.activeBuffer.set(component.id, component);
        this.inactiveBuffer.delete(component.id);
    }

    /**
     * Takes a {@link Scene} and translates it to the DOM
     * @param scene description of what to draw
     */
    draw(scene: Scene) {
        this.updateRootComponent(scene.size);

        const itemQueue = [];
        for (const item of scene.contents) {
            // if the inactive doesnt have the item, then it's new
            let component = this.inactiveBuffer.get(item.id);
            if (!component) {
                itemQueue.push(item);
            } else {
                this.setItemComponent(component, item);
            }
        }

        this.createItemComponents(itemQueue);
        this.swapBuffer();
    }
}
