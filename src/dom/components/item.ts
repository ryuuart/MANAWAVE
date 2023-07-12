import { Item } from "@manawave/ticker/item";
import { Component } from "../component";
import styles from "../styles/item.module.css";
export default class ItemComponent extends Component {
    private _position: vec2;
    element: HTMLElement;

    constructor(item: Item, template?: DocumentFragment) {
        const container = document.createElement("div");
        container.classList.add(styles.item);
        const element = document.createElement("div");
        container.append(element);
        if (template) element.append(template.cloneNode(true));

        super(container, item.id);

        this.element = element;
        this._position = item.position;
        this.setPosition(structuredClone(item.position));
    }

    /**
     * Get the current position of the component
     */
    get position(): vec2 {
        return structuredClone(this._position);
    }

    /**
     *  Updates current position to a new one
     *
     * @param pos new position to set
     */
    setPosition(pos: vec2) {
        this._position = structuredClone(pos);
        this.html.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    }
}
