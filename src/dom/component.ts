import { uid } from "@ouroboros/utils/uid";
import { setSize } from "./utils";

/**
 * A unit of UI. It's really a wrapper for HTMLElement.
 * It's preferable not fully expose HTMLElement so that
 * data has more control over how the UI is rendered.
 */
export abstract class Component<T extends HTMLElement = HTMLElement> {
    id: string;

    protected html: T;
    protected _parent: Component | undefined;
    protected _children: Set<Component>;
    protected _size: Rect;

    constructor(html: T, id?: string) {
        this._children = new Set();

        this._size = { width: 0, height: 0 };
        this.html = html;

        if (id) this.id = id;
        else this.id = uid();
    }

    /**
     * Returns all children of this component
     */
    get children(): IterableIterator<Component> {
        return this._children.values();
    }

    /**
     * Returns the current size of the component
     */
    get size(): Rect {
        return this._size;
    }

    /**
     * Makes the specified component a subchild of this component
     *
     * @param component specified child component
     */
    append(component: Component) {
        component._parent = this;
        this._children.add(component);
        this.html.append(component.html);
    }

    /**
     * Takes the component's HTML representation to add to some external HTMLElement
     * @param html HTMLElement to render this Component to
     */
    appendToDOM(html: HTMLElement) {
        if (!this.html.isConnected) html.append(this.html);
    }

    /**
     * Removes selected child component if it's a child to this component.
     * @param component child component to remove
     */
    removeChild(component: Component) {
        if (this._children.has(component)) {
            component._parent = undefined;
            this._children.delete(component);
            component.html.remove();
        }
    }

    /**
     * Hook that should be invoked when removing this component
     * from the scene.
     */
    onRemove() {
        this.html.remove();
    }

    /**
     * Updates the size of the Component
     * @param rect new width and height to set
     */
    setSize(rect: Rect) {
        this._size = rect;
        setSize(this.html, rect);
    }
}
