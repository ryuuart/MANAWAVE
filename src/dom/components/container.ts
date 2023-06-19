import { Component } from "../component";
import styles from "../styles/ticker.module.css";

export default class TickerComponent extends Component {
    constructor(id: string) {
        const element = document.createElement("div");
        element.classList.add(styles.container);

        super(element, id);
    }
}
