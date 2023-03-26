import { wrappedDiv, wrappedSpan, cloneChild } from "./dom";
import Dimensions from "./dimensions";
import anime from "animejs";
import { getXAttr } from "./tickerDomUtils";
import { setX, translateX } from "./animation";
import TickerSystem from "./TickerSystem";

/**
 * HTML ShadowDOM element (with no shadowroot) that contains the repeated elements
 */
export default class BillboardTicker extends HTMLElement {
  tickerElementTemp: HTMLElement;
  tickerElement: HTMLElement;
  billboardTickerElement: HTMLElement;

  constructor() {
    super();
    // Element represents the element to be repeated (the template if you will)
    this.tickerElementTemp = wrappedDiv(this.children);
    this.tickerElementTemp.classList.add("ticker-element-temp");

    // Element-wrapper refers to a wrapper that allows for dimensional calculations
    // What you want to clone
    this.tickerElement = wrappedDiv(this.tickerElementTemp);
    this.tickerElement.classList.add("ticker-element");

    // Billboard-ticker refers to what represents the entire Billboard-ticker itself
    this.billboardTickerElement = wrappedDiv(this.tickerElement);
    this.billboardTickerElement.classList.add("billboard-ticker");

    this.append(this.billboardTickerElement);
  }

  connectedCallback() {
    let currAnim: anime.AnimeInstance;
    let animLock: boolean = false;

    Dimensions.init(this, this.tickerElement);

    setX(this.tickerElement, 0);
    TickerSystem.register(this.tickerElement, [0, 0]);
    for (let i = 1; i <= 2; i++) {
      const clonedChild = cloneChild(this.tickerElement);
      if (clonedChild) {
        setX(clonedChild as Element, i * Dimensions.TICKER_ELEMENT_WIDTH);
        TickerSystem.register(clonedChild as Element, [
          i * Dimensions.TICKER_ELEMENT_WIDTH,
          0,
        ]);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (
            !e.isIntersecting &&
            e.rootBounds &&
            e.boundingClientRect.left >= e.rootBounds.width
          ) {
            console.log(e.boundingClientRect.left);
            TickerSystem.message("loop", e.target);
          }
        });
      },
      {
        root: this,
        threshold: 0,
      }
    );
    TickerSystem.start();

    Array.from(this.billboardTickerElement.children).forEach((e) => {
      observer.observe(e);
    });
  }
}
