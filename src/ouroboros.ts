import { System } from "./anim";
import { fromTAttributes, generateTOptions } from "./dom/attributes";
import TickerSystem from "./ticker/system";

export class Ouroboros extends System {
    // private tState: TickerState;
    private simulation!: TickerSystem;

    private _selector: keyof HTMLElementTagNameMap;
    private _options?: Ouroboros.Options;

    constructor(
        selector: keyof HTMLElementTagNameMap,
        options?: Ouroboros.Options
    ) {
        super();

        this._selector = selector;
        this._options = options;

        this.start();
    }

    onStart() {
        const element = document.querySelector(this._selector);
        if (element) {
            const currOptions = generateTOptions(element, this._options);

            // TODO: in the future, there will be logic that guarantees
            // measurement without worrying about order
            const tProps = {
                speed: currOptions.speed,
                direction: currOptions.direction,
            };

            const tSizes = {
                ticker: { width: 10, height: 10 },
                item: { width: 10, height: 10 },
            };

            this.simulation = new TickerSystem(tSizes, tProps);
        } else {
            throw new Error("Element not found for Ouroboros.");
        }
    }

    onUpdate(dt: number, t: number): void {}

    onDraw(): void {}
}
