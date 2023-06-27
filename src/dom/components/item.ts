import { Item } from "@ouroboros/ticker/item";
import { Component } from "../component";
import styles from "../styles/item.module.css";
export default class ItemComponent extends Component {
    constructor(item: Item, template?: DocumentFragment) {
        const element = document.createElement("div");
        element.classList.add(styles.item);
        if (template) element.append(template.cloneNode(true));

        super(element, item.id);

        this.setPosition(structuredClone(item.position));
    }

    /**
     *  Updates current position to a new one
     *
     * @param pos new position to set
     */
    setPosition(pos: vec2) {
        this.html.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    }
}
