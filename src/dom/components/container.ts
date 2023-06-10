import { Component } from "../component";
import styles from "../styles/ticker.module.css";

export class ContainerHTML extends Component {
    constructor() {
        const element = document.createElement("div");
        element.classList.toggle(styles.container);

        super(element);
    }
}
