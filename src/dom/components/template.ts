import { Component } from "../component";
import styles from "../styles/item.module.css";

export default class TemplateComponent extends Component<HTMLTemplateElement> {
    constructor(baseHTML: HTMLElement | NodeList | HTMLCollection) {
        const element = document.createElement("template");
        element.classList.add(styles.template);
        // we don't want to hide these
        if (baseHTML instanceof HTMLElement) {
            element.content.append(baseHTML);
        } else {
            element.content.append(...baseHTML);
        }

        super(element);
    }

    cloneDOM(): NodeListOf<ChildNode> {
        return this.html.content.cloneNode(true).childNodes;
    }
}
