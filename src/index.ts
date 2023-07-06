import { AnimationController } from "./anim";
import { MW } from "./manawave";
import WebComponent from "./dom/element";
import "./dom/styles/styles.css";

if (!customElements.get("manawave-ticker")) {
    customElements.define("manawave-ticker", WebComponent);
}

AnimationController.start();

export { MW };
