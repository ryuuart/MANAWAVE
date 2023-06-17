import { Item } from "@ouroboros/ticker/item";
import { Component } from "../component";
import styles from "../styles/item.module.css";

export default class ItemComponent extends Component {
    position: vec2;
    constructor(id: string, item: Item) {
        const element = document.createElement("div");
        element.classList.add(styles.item);

        super(element, id);

        this.position = item.position;
    }
}
