import styles from "../styles/ticker.module.css";

export class ContainerHTML {
    private _html: HTMLElement;

    constructor() {
        this._html = document.createElement("div");
        this._html.classList.toggle(styles.container);
    }
}
