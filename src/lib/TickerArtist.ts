import { Clone } from "@billboard/clones";
import { TickerItem } from "@billboard/ticker";

export default class TickerArtist {
    private _tickerItem: TickerItem;
    private _clone: Clone | undefined;

    constructor(item: TickerItem) {
        this._tickerItem = item;
        this._tickerItem.prepareArtist(this);
    }

    set clone(clone: Clone) {
        this._clone = clone;
    }

    drawToPosition(position: Position) {
        if (this._clone) this._clone.setPosition(position);
    }
}
