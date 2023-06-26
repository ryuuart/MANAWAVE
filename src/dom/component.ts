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
    protected _size: Rect;

    constructor(html: T, id?: string) {
        this._size = { width: 0, height: 0 };
        this.html = html;

        if (id) this.id = id;
        else this.id = uid();
    }

    /**
     * Returns the current size of the component
     */
    get size(): Rect {
        return this._size;
    }

    /**
     * Takes the component's HTML representation to add to some external HTMLElement
     * @param html HTMLElement to render this Component to
     */
    appendToDOM(html: HTMLElement | DocumentFragment) {
        if (html instanceof HTMLElement) {
            if (!this.html.isConnected)
                setTimeout(() => {
                    html.append(this.html);
                }, 0);
        } else {
            html.append(this.html);
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
