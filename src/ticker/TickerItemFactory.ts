import { Ticker, TickerItem } from "../ticker";
import { Cloner } from "../clones";
import { TickerStore } from "../data";

export default class TickerItemFactory {
    tickerItemRegistry: TickerStore;
    cloner: Cloner;
    _referenceTicker: { append: (tickerItem: TickerItem) => void }; // keep track of the ticker it should be adding clones to for loading purposes

    constructor(
        registry: TickerStore,
        cloner: Cloner,
        ticker: { append: (tickerItem: TickerItem) => void }
    ) {
        this._referenceTicker = ticker;
        this.tickerItemRegistry = registry;
        this.cloner = cloner;
    }

    // create a single instance
    create(n: number): TickerItem[] {
        const items: TickerItem[] = [];
        this.cloner.clone(n, (clone) => {
            const item = new TickerItem(clone);
            item.registerStore(this.tickerItemRegistry);
            this._referenceTicker.append(item);
            items.push(item);
        });

        return items;
    }

    // create a sequence
    sequence(): TickerItem[] {
        const items: TickerItem[] = [];
        this.cloner.cloneSequence({
            fn: (clone) => {
                const item = new TickerItem(clone);
                item.registerStore(this.tickerItemRegistry);
                this._referenceTicker.append(item);
                items.push(item);
            },
        });

        return items;
    }
}
