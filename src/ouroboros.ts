import PlaybackObject from "./anim/PlaybackObject";
import { convertDirection, mergeOOptions } from "./dom/attributes";
import { measure, measureElementBox } from "./dom/measure";
import TickerSystem from "./ticker/system";
import styles from "./dom/styles/ouroboros.module.css";
import { AnimationController } from "./anim";

export class Ouroboros extends PlaybackObject {
    private simulation!: TickerSystem;

    private _selector: Parameters<Document["querySelector"]>[0] | HTMLElement;
    private _options?: Partial<Ouroboros.Options>;

    constructor(
        selector: Parameters<Document["querySelector"]>[0] | HTMLElement,
        options?: Partial<Ouroboros.Options>
    ) {
        super();

        this._selector = selector;
        this._options = options;

        this.start();
    }

    onStart() {
        let element: HTMLElement;
        if (this._selector instanceof HTMLElement) element = this._selector;
        else element = document.querySelector(this._selector) as HTMLElement;

        if (element) {
            element.classList.add(styles.ouroboros);
            const currOptions = mergeOOptions(element, this._options);

            // TODO: in the future, there will be logic that guarantees
            // measurement without worrying about order
            const tProps = {
                speed: currOptions.speed,
                direction: convertDirection(currOptions.direction),
            };

            const tSizes = {
                ticker: measure(element)!,
                item: measureElementBox(element.children),
            };

            this.simulation = new TickerSystem(element, {
                attributes: tProps,
                sizes: tSizes,
            });

            AnimationController.registerSystem(this.simulation);
            this.simulation.start();
            if (!currOptions.autoplay) this.simulation.pause();
        } else {
            throw new Error("Element not found for Ouroboros.");
        }
    }

    onStop() {
        this.simulation.stop();
        AnimationController.deregisterSystem(this.simulation);
    }
}
