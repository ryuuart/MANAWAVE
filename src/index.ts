import { AnimationController } from "./anim";
import { Ouroboros } from "./ouroboros";
import WebComponent from "./dom/element";

if (!customElements.get("ouroboros-ticker")) {
    customElements.define("ouroboros-ticker", WebComponent);
}

AnimationController.start();

export { Ouroboros };
