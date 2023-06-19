import { Item } from "@ouroboros/ticker/item";
import { Component } from "../component";
import styles from "../styles/item.module.css";
import TemplateComponent from "./template";

export default class ItemComponent extends Component {
    position: vec2;
    constructor(id: string, item: Item, template?: TemplateComponent) {
        const element = document.createElement("div");
        element.classList.add(styles.item);
        if (template) element.append(...template.cloneDOM());

        super(element, id);

        this.position = item.position;
    }

    setPosition(pos: vec2) {
        this.html.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    }
}
