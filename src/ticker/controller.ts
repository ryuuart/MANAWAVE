import { Dimensions } from "@ouroboros/dom/measure";
import Context from "./context";
import TickerSystem from "./system";

export default class Controller {
    private _dimensions: Dimensions;
    private _system: TickerSystem;

    constructor(context: Context) {
        this._dimensions = new Dimensions();
        this._system = new TickerSystem(context);

        this._dimensions.setEntry("root", context.root, (rect: Rect) => {
            this._system.updateSimulation({
                sizes: { ticker: context.tickerSize },
            });
        });
        this._dimensions.setEntry("item", context.itemMBox, (rect: Rect) => {
            this._system.updateSimulation({
                sizes: { item: context.tickerSize },
            });
        });
    }
}
