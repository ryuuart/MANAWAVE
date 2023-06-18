import { AnimationController } from "./anim";
import { Ouroboros } from "./ouroboros";
import WebComponent from "./dom/element";
import "./dom/styles/styles.css";

if (!customElements.get("ouroboros-ticker")) {
    customElements.define("ouroboros-ticker", WebComponent);
}

AnimationController.start();

export { Ouroboros };
