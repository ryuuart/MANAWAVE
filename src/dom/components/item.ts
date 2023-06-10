import { Component } from "../component";
import { TemplateHTML } from "./template";
import styles from "../styles/item.module.css";

export class ItemHTML extends Component {
    constructor(template: TemplateHTML) {
        const element = document.createElement("div");
        element.append(...template.clone());
        element.classList.add(styles.item);

        super(element);
    }
}
