import { TickerItem } from ".";
import { Clone, Cloner, Template } from "../clones";
import Component from "../web/Component";
import TickerItemFactory from "./TickerItemFactory";

// Represents front-facing Ticker that is rendered
// Logic for placing clones in front-facing ticker should go here
// Logic representing the system should not go here
export default class Ticker {
    private _wrapperElement: HTMLElement;
    private _element: HTMLElement;
    private _height: number; // needed to make the absolute positioning work

    private _initialTemplate: Template | undefined | null; // needed to restore the state of the ticker before start

    constructor(element: HTMLElement) {
        // The main element that contains anything relating to Billboard
        this._wrapperElement = element;
        if (!(this._wrapperElement instanceof Component)) {
            this._wrapperElement.classList.add("billboard-ticker");
        }

        // Billboard-ticker refers to what represents the entire Billboard-ticker itself
        this._element = document.createElement("div");
        this._element.classList.add("billboard-ticker-container");

        this._height = this._wrapperElement.offsetHeight;
        this._element.style.minHeight = `${this._height}px`;

        this.init();
    }

    get isRendered() {
        return this._wrapperElement.contains(this._element);
    }

    get initialTemplate() {
        return this._initialTemplate;
    }

    init() {
        this._initialTemplate = new Template(this._wrapperElement.children);
        this._wrapperElement.append(this._element);
    }

    deinit() {
        if (this._initialTemplate != undefined) {
            this._initialTemplate.restore();
            this._initialTemplate = null;
        }
        if (this._element != undefined) {
            this._element.remove();
        }
        if (this._wrapperElement != undefined) {
            this._wrapperElement.classList.remove("billboard-ticker");
        }
    }

    getSequenceDimensions(sequence: TickerItem[]): {
        width: number;
        height: number;
    } {
        const initialSequence: TickerItem[] = sequence;
        // measure sequence width and height
        let templateSequence = { width: 0, height: 0 };
        for (const tickerItem of initialSequence) {
            const { width: itemWidth, height: itemHeight } =
                tickerItem.dimensions;

            templateSequence.width += itemWidth;
            templateSequence.height = Math.max(
                templateSequence.height,
                itemHeight
            );
        }

        return templateSequence;
    }

    getItemRepetitions(sequence: TickerItem[]): { x: number; y: number } {
        let repetition = { x: 0, y: 0 };
        const templateSequence = this.getSequenceDimensions(sequence);

        // actual calculations
        // likely to generate more than needed but better safe than sorry
        repetition = {
            x:
                Math.round(this._element.offsetWidth / templateSequence.width) +
                2,
            y:
                Math.round(
                    this._element.offsetHeight / templateSequence.height
                ) + 2,
        };

        return repetition;
    }

    initClones(factory: TickerItemFactory) {
        const initialSequence: TickerItem[] = factory.sequence();
        const templateSequence = this.getSequenceDimensions(initialSequence);
        const repetition = this.getItemRepetitions(initialSequence);

        // add all the new clones
        const tickerItems = initialSequence.concat(
            factory.create(repetition.x * repetition.y - 1)
        );

        let position: [number, number] = [
            -templateSequence.width,
            -templateSequence.height,
        ];

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

    updateHeight() {
        if (this._wrapperElement.offsetHeight > this._height) {
            this._height = this._wrapperElement.offsetHeight;
            this._element.style.minHeight = `${this._height}px`;
        }
    }

    // Add in a lil element but if it's a lil too big, then the ticker needs to resize
    // [TODO] figure out responsiveness part
    // might need to remove this part if someone already gave it a height that's less
    // than any other height :/
    append(item: TickerItem) {
        const { height: itemHeight } = item.dimensions;

        item.appendTo(this._element);

        if (itemHeight > this._height) {
            this._height = itemHeight;
            this._element.style.minHeight = `${this._height}px`;
        }
    }
}
