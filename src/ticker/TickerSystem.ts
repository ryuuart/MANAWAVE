import { System } from "@billboard/lib";
import { Ticker, TickerItem } from ".";
import { TickerStore } from "../data";
import TickerItemFactory from "./TickerItemFactory";
import TickerArtist from "@billboard/lib/TickerArtist";
import Lifecycle from "@billboard/lib/Lifecycle";

export default class TickerSystem extends System {
    private _ticker: Ticker;
    private _tickerItemStore: TickerStore;
    private _tickerItemFactory: TickerItemFactory;
    private _lifecycle: Lifecycle;

    constructor(element: HTMLElement) {
        super();

        this._ticker = new Ticker(element);
        this._tickerItemStore = new TickerStore();
        this._lifecycle = new Lifecycle();

        this._tickerItemFactory = new TickerItemFactory(
            this._tickerItemStore,
            this._ticker,
            this._lifecycle
        );
    }

    setOnItemCreated(callback: (element: HTMLElement) => void) {
        this._lifecycle.onCreated = callback;
    }
    setOnItemDestroyed(callback: (element: HTMLElement) => void) {
        this._lifecycle.onDestroyed = callback;
    }
    setEachItem(callback: (element: HTMLElement) => void) {
        this._lifecycle.each = callback;

        for (const ti of this.allItems) {
            ti.each();
        }
    }

    get allItems(): IterableIterator<TickerItem> {
        return this._tickerItemStore.allTickerItems;
    }

    getItemsByCondition(
        predicate: (item: TickerItem) => boolean
    ): TickerItem[] {
        return Array.from(this.allItems).filter(predicate);
    }

    getItemById(id: number): TickerItem | null {
        return this._tickerItemStore.get(id);
    }

    getItemByElement(element: Element): TickerItem | null {
        return this._tickerItemStore.get(element);
    }

    fill() {
        this.clear();

        const initialSequence: TickerItem[] =
            this._tickerItemFactory.sequence();
        const sequenceDimensions = initialSequence.reduce(
            (accum: Dimensions, curr: TickerItem) => {
                const currDimensions = curr.dimensions;

                return {
                    width: accum.width + currDimensions.width,
                    height: Math.max(accum.height, currDimensions.height),
                };
            },
            { width: 0, height: 0 }
        );

        const repetition = {
            x:
                Math.ceil(
                    this._ticker.dimensions.width / sequenceDimensions.width
                ) + 2,
            y:
                Math.ceil(
                    this._ticker.dimensions.height / sequenceDimensions.height
                ) + 2,
        };

        const position: Position = [
            -sequenceDimensions.width,
            -sequenceDimensions.height,
        ];

        const tickerItems = initialSequence.concat(
            this._tickerItemFactory.create(repetition.x * repetition.y - 1)
        );

        // iterate through clones and properly set the positions
        let clonesIndex = 0;
        let currItem = tickerItems[clonesIndex];
        for (let i = 0; i < repetition.y; i++) {
            for (let j = 0; j < repetition.x; j++) {
                currItem = tickerItems[clonesIndex];
                const { width: itemWidth, height: itemHeight } =
                    currItem.dimensions;

                currItem.position = [
                    position[0] + j * itemWidth,
                    position[1] + i * itemHeight,
                ];
                clonesIndex++;
            }
        }
    }

    addItem(position?: Position) {
        const tickerItem = this._tickerItemFactory.create(1)[0];

        if (position) tickerItem.position = position;
    }

    addNItem(n: number, callback?: (i: number) => Position) {
        const tickerItems = this._tickerItemFactory.create(n);

        if (callback) {
            tickerItems.forEach((item, i) => {
                item.position = callback(i);
            });
        }
    }

    removeItem(item: TickerItem) {
        item.remove();
    }

    removeSelection(items: TickerItem[]) {
        for (const item of items) {
            item.remove();
        }
    }

    // remove all clones
    clear() {
        for (const item of this._tickerItemStore.allTickerItems) {
            item.remove();
        }
    }

    load() {
        if (this._tickerItemFactory.templateIsEmpty) {
            this._ticker.reloadInitialTemplate();
            this._tickerItemFactory.addTemplate(this._ticker.initialTemplate!);
        }
        this.fill();
        this._ticker.load();
    }

    unload() {
        this.clear();
        this._tickerItemFactory.clearTemplates();
        this._ticker.unload();
    }

    onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
        for (const item of this._tickerItemStore.allTickerItems) {
            item.lifetime += dt;
        }
    }

    onDraw() {
        for (const item of this._tickerItemStore.allTickerItems) {
            const artist = new TickerArtist(item);

            artist.drawToPosition(item.position);
        }
    }
}
