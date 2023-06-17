import { uid } from "@ouroboros/utils/uid";

export abstract class Component<T extends HTMLElement = HTMLElement> {
    id: string;

    protected html: T;
    protected _parent: Component | undefined;
    protected _children: Set<Component>;

    constructor(html: T, id?: string) {
        this._children = new Set();

        this.html = html;

        if (id) this.id = id;
        else this.id = uid();
    }

    get children(): IterableIterator<Component> {
        return this._children.values();
    }

    append(component: Component) {
        this._children.add(component);
        this.html.append(component.html);
    }

    appendToDOM(html: HTMLElement) {
        html.append(this.html);
    }

    removeChild(component: Component) {
        this._children.delete(component);
    }

    onRemove() {
        this.html.remove();
    }

    setSize(rect: Rect) {
        this.html.style.width = `${rect.width}px`;
        this.html.style.height = `${rect.height}px`;
    }
}
