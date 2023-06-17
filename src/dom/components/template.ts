import { Component } from "../component";
import styles from "../styles/item.module.css";

export default class TemplateComponent extends Component<HTMLTemplateElement> {
    constructor(baseHTML: HTMLElement) {
        const element = document.createElement("template");
        element.classList.add(styles.template);
        element.content.append(baseHTML.cloneNode(true));

        super(element);
    }

    cloneDOM(): NodeListOf<ChildNode> {
        return this.html.content.cloneNode(true).childNodes;
    }
}
