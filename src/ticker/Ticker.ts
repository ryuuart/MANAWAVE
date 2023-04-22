import { TickerItem } from ".";
import { Clone, Cloner, Template } from "../clones";
import Component from "../web/Component";
import TickerItemFactory from "./TickerItemFactory";

// Represents front-facing Ticker that is rendered
// Logic for placing clones in front-facing ticker should go here
// Logic representing the system should not go here
export default class Ticker {
    wrapperElement: HTMLElement;
    element: HTMLElement;
    height: number; // needed to make the absolute positioning work

    initialTemplate: Template; // needed to restore the state of the ticker before start

    constructor(element: HTMLElement) {
        // The main element that contains anything relating to Billboard
        this.wrapperElement = element;
        if (!(this.wrapperElement instanceof Component)) {
            this.wrapperElement.classList.add("billboard-ticker");
        }

        // Billboard-ticker refers to what represents the entire Billboard-ticker itself
        this.element = document.createElement("div");
        this.element.classList.add("billboard-ticker-container");

        this.height = this.wrapperElement.offsetHeight;
        this.element.style.minHeight = `${this.height}px`;

        this.initialTemplate = new Template(this.wrapperElement.children);
        this.wrapperElement.append(this.element);
    }

    init() {}

    initClones(factory: TickerItemFactory) {
        const tickerItems: TickerItem[] = factory.sequence();

        // measure sequence width and height
        let templateSequence = { width: 0, height: 0 };
        for (const tickerItem of tickerItems) {
            const { width: itemWidth, height: itemHeight } =
                tickerItem.getDimensions();

            templateSequence.width += itemWidth;
            templateSequence.height = Math.max(
                templateSequence.height,
                itemHeight
            );
        }

        // actual calculations
        // likely to generate more than needed but better safe than sorry
        let repetition = {
            x: Math.ceil(this.element.offsetWidth / templateSequence.width) + 2,
            y:
                Math.ceil(this.element.offsetHeight / templateSequence.height) +
                2,
        };

        // add all the new clones
        tickerItems.concat(factory.create(repetition.x * repetition.y - 1));

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
                    currItem.getDimensions();

                currItem.setPosition([
                    position[0] + j * itemWidth,
                    position[1] + i * itemHeight,
                ]);
                clonesIndex++;
            }
        }
    }

    // Add in a lil element but if it's a lil too big, then the ticker needs to resize
    // [TODO] figure out responsiveness part
    // might need to remove this part if someone already gave it a height that's less
    // than any other height :/
    append(item: TickerItem) {
        const { height: itemHeight } = item.getDimensions();

        if (itemHeight > this.height) {
            this.height = itemHeight;
            this.element.style.minHeight = `${this.height}px`;
        }
    }
}
