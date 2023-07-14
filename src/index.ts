import { AnimationController } from "./anim";
import { MW } from "./manawave";
import WebComponent from "./dom/element";
import "./dom/styles/styles.css";
import MWM from "./MWM";

if (!customElements.get("manawave-ticker")) {
    customElements.define("manawave-ticker", WebComponent);
}

AnimationController.start();

function getMW(element: HTMLElement): MW | undefined {
    return MWM.get(element);
}
export { MW, getMW };
