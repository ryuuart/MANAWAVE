import { AnimationController } from "./anim";
import { MW } from "./MW";
import MWM from "./MWM";
import "./dom/styles/styles.css";
import WebComponent from "./dom/element";

// registers the custom web component
if (!customElements.get("manawave-ticker")) {
    customElements.define("manawave-ticker", WebComponent);
}

// starts main animation loop
AnimationController.start();

/**
 * Retrieves a {@link MW} controller object
 * @param element root element of some manawave ticker
 * @returns the {@link MW} controller object or `undefined` if not found
 */
function getMW(element: HTMLElement): MW | undefined {
    return MWM.get(element);
}

export { MW, getMW };
