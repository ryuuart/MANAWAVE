import { AnimationController } from "./anim";
import { Ouroboros } from "./ouroboros";
import WebComponent from "./dom/element";

if (!customElements.get("billboard-ticker")) {
    customElements.define("billboard-ticker", WebComponent);
}

AnimationController.start();

export { Ouroboros };
