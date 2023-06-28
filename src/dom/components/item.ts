import { Item } from "@ouroboros/ticker/item";
import { Component } from "../component";
import styles from "../styles/item.module.css";
export default class ItemComponent extends Component {
    private _position: vec2;

    constructor(item: Item, template?: DocumentFragment) {
        const element = document.createElement("div");
        element.classList.add(styles.item);
        if (template) element.append(template.cloneNode(true));

        super(element, item.id);

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
