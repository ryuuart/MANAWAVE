import styles from "../styles/item.module.css";

export class TemplateHTML {
    private _html: HTMLTemplateElement;

    constructor(original: HTMLElement) {
        this._html = document.createElement("template");
        this._html.append(original.cloneNode(true));
        this._html.classList.add(styles.template);
    }

    clone(): Node[] {
        return Array.from(this._html.content.cloneNode(true).childNodes);
    }
}
