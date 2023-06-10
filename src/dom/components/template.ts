import { Component } from "../component";
import styles from "../styles/item.module.css";

export class TemplateHTML extends Component<HTMLTemplateElement> {
    constructor(original: HTMLElement) {
        const element = document.createElement("template");
        element.append(original.cloneNode(true));
        element.classList.add(styles.template);

        super(element);
    }

    clone(): Node[] {
        return Array.from(this.html.content.cloneNode(true).childNodes);
    }
}
