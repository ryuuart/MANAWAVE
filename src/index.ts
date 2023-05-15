import Billboard from "./Billboard";
import { AnimationController } from "./anim";
import Component from "./web/Component";

if (!customElements.get("billboard-ticker")) {
    customElements.define("billboard-ticker", Component);
}

AnimationController.start();

export { Billboard };
