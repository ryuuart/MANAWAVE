import { System } from "./anim";
import { convertDirection, mergeOOptions } from "./dom/attributes";
import TickerSystem from "./ticker/system";

export class Ouroboros extends System {
    private simulation!: TickerSystem;

    private _selector: keyof HTMLElementTagNameMap;
    private _options?: Partial<Ouroboros.Options>;

    constructor(
        selector: keyof HTMLElementTagNameMap,
        options?: Partial<Ouroboros.Options>
    ) {
        super();

        this._selector = selector;
        this._options = options;

        this.start();
    }

    onStart() {
        const element = document.querySelector(this._selector);
        if (element) {
            const currOptions = mergeOOptions(element, this._options);

            // TODO: in the future, there will be logic that guarantees
            // measurement without worrying about order
            const tProps = {
                speed: currOptions.speed,
                direction: convertDirection(currOptions.direction),
            };

            const tSizes = {
                ticker: { width: 10, height: 10 },
                item: { width: 10, height: 10 },
            };

            this.simulation = new TickerSystem(tSizes, tProps);
            this.simulation.start();
        } else {
            throw new Error("Element not found for Ouroboros.");
        }
    }

    onStop() {
        this.simulation.stop();
    }

    onUpdate(dt: number, t: number): void {}

    onDraw(): void {}
}
