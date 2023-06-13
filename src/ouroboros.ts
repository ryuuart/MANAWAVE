import { System } from "./anim";
import { TickerState } from "./ticker/state";
import { fromTAttributes, generateTOptions } from "./dom/attributes";
import TickerSystem from "./ticker/system";

export type OuroborosOptions = {
    autoplay: boolean;
    direction: "up" | "right" | "down" | "left" | string;
    speed: number;
};

export type OptionalOuroborosOptions = {
    [Property in keyof OuroborosOptions]+?: OuroborosOptions[Property];
};

export class Ouroboros extends System {
    private tParams!: TickerState;
    // private tState: TickerState;
    private simulation!: TickerSystem;

    private _selector: keyof HTMLElementTagNameMap;
    private _options?: OptionalOuroborosOptions;

    constructor(
        selector: keyof HTMLElementTagNameMap,
        options?: OptionalOuroborosOptions
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
            this.tParams = new TickerState({
                ticker: { size: { width: 10, height: 10 } },
                item: { size: { width: 10, height: 10 } },
                speed: currOptions.speed,
                direction: currOptions.direction,
                autoplay: currOptions.autoplay,
            });

            this.simulation = new TickerSystem(this.tParams.current);
        } else {
            throw new Error("Element not found for Ouroboros.");
        }
    }

    onUpdate(dt: number, t: number): void {}

    onDraw(): void {}
}
