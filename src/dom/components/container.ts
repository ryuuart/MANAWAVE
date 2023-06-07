import styles from "../styles/ticker.module.css";

export class ContainerHTML {
    private html: HTMLElement;

    constructor() {
        this.html = document.createElement("div");

        this.html.classList.toggle(styles.container);
    }

    /**
     * Takes data and udpates the html element
     * @param data data to be ingested by the render function
     * @returns the updated html element
     */
    render(data?: object) {
        return this.html;
    }
}
