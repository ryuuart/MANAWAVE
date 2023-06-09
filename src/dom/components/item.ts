import styles from "../styles/item.module.css";
import { TemplateHTML } from "./template";

export class ItemHTML {
    private _html: HTMLElement;

    constructor(template: TemplateHTML) {
        this._html = document.createElement("div");
        this._html.append(...template.clone());
        this._html.classList.add(styles.item);
    }
}
