import { debounce } from "~src/utils";
import { Ticker, TickerItem } from ".";
import { TickerStore } from "../data";
import TickerItemFactory from "./TickerItemFactory";

export default class TickerSystem {
    ticker: Ticker;
    tickerItemStore: TickerStore;
    tickerItemFactory: TickerItemFactory;

    constructor(element: HTMLElement) {
        this.ticker = new Ticker(element);
        this.tickerItemStore = new TickerStore();

        this.tickerItemFactory = new TickerItemFactory(
            this.tickerItemStore,
            this.ticker
        );

        window.addEventListener(
            "resize",
            debounce(this.resize.bind(this), 500)
        );
        this.init();
    }

    fill() {
        this.clear();

        const initialSequence: TickerItem[] = this.tickerItemFactory.sequence();
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
                Math.round(
                    this.ticker.dimensions.width / sequenceDimensions.width
                ) + 2,
            y:
                Math.round(
                    this.ticker.dimensions.height / sequenceDimensions.height
                ) + 2,
        };
        const position: Position = [
            -sequenceDimensions.width,
            -sequenceDimensions.height,
        ];

        const tickerItems = initialSequence.concat(
            this.tickerItemFactory.create(repetition.x * repetition.y - 1)
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

    // remove all clones
    clear() {
        for (const item of this.tickerItemStore.allTickerItems) {
            item.remove();
        }
    }

    init() {
        if (this.tickerItemFactory.templateIsEmpty)
            this.tickerItemFactory.addTemplate(this.ticker.initialTemplate!);
        this.fill();
    }

    deinit() {
        this.clear();
        this.tickerItemFactory.clearTemplates();
        this.ticker.deinit();
    }

    resize() {
        this.clear();
        this.ticker.height = -1;
        this.init();
    }
}
