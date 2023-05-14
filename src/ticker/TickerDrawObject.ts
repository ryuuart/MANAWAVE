import DOMDrawObject from "@billboard/lib/DOMDrawObject";
import { TickerItem } from ".";

export default class TickerDrawObject extends DOMDrawObject {
    private _tickerItem: TickerItem;
    private _position: Position;

    constructor(element: Element, item: TickerItem) {
        super(element);

        this._tickerItem = item;
        this._position = this._tickerItem.position;
    }

    get position(): Position {
        return this._position;
    }

    get domPosition() {
        return this._tickerItem.position;
    }
}
