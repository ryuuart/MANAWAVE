import { Component } from "../component";
import styles from "../styles/ticker.module.css";

/**
 * Represents a Ticker that would repeat ItemComponent across it
 */
export default class TickerComponent extends Component {
    constructor() {
        const element = document.createElement("div");
        element.classList.add(styles.container);

        super(element);
    }

    /**
     * Takes a list of DOM Nodes stored in a {@link DocumentFragment} and appends
     * them to to this component's DOM.
     *
     * While technically {@link ItemComponent} should be used, it would reduce the
     * performance to a slightly noticeable amount. The cost of packing and unpacking
     * {@link ItemComponent} causes the performance dip. That's why a {@link DocumentFragment}
     * is required.
     *
     * @param items a {@link DocumentFragment} containing nodes to add
     */
    appendChildDOM(items: DocumentFragment) {
        this.html.append(items);
    }
}
