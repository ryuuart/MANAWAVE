import Billboard from "./Billboard";
import Component from "./web/Component";

if (!customElements.get("billboard-ticker")) {
    customElements.define("billboard-ticker", Component);
}

export { Billboard };
