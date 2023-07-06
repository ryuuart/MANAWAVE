import { AnimationController } from "./anim";
import { MW } from "./manawave";
import WebComponent from "./dom/element";
import "./dom/styles/styles.css";

if (!customElements.get("ouroboros-ticker")) {
    customElements.define("ouroboros-ticker", WebComponent);
}

AnimationController.start();

export { MW };
