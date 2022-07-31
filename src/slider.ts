import anime from "animejs";

import { debounce } from "./interaction";

/**
 * The HTML Slider that Billboard sets up and manipulates
 */
export default class Slider {
  tickerHTMLElement: HTMLElement;
  tickerItems: NodeList;
  content: HTMLElement;
  currentRepetitions: number = 0;
  contentBoundingBox: DOMRect;
  animations: Animation[] = [];

  /**
   * Setup an individual slider
   * @param {string} id  - The HTML ID that will be selected as the slider container
   */
  constructor(public id: string = "billboard") {
    this.tickerHTMLElement = document.getElementById(id)!;

    if (!this.tickerHTMLElement) {
      throw "Billboard Ticker Element not found. Make sure your IDs are correctly defined.";
    }

    // Setup required CSS
    const sliderStyles = document.createElement("style");
    document.head.appendChild(sliderStyles);
    sliderStyles.sheet?.insertRule(
      `
      #${id} {
        white-space: nowrap;
        overflow: hidden;

        position: relative;
      }
    `
    );

    this.tickerItems = this.tickerHTMLElement.querySelectorAll(`#${id} > *`)!;

    if (!this.tickerItems.length) {
      throw "Make sure there is something to repeat in the billboard";
    }

    this.setup();
    this.animate();
  }

  /**
   * Set the slider container up and wrap the repeatable elements into a content wrapper element.
   *
   * The content wrapper element will be used as a template to be cloned multiple times. It's also
   * the single source of truth in terms of dimensions from the starting point.
   */
  setup() {
    // Create a content wrapper to determine the total width and repetitions we need to fill the ticker
    this.content = document.createElement("div");
    this.content.style.display = "inline-block";

    // Fill the base content wrapper
    this.tickerItems.forEach((e) => {
      this.content.append(e);
    });

    this.contentBoundingBox = this.content.getBoundingClientRect();

    this.tickerHTMLElement.append(this.content);

    // Calculate the number of repetitions needed
    this.clone(this.getRepititions());

    // Attach events that should update our slider
    this.setupEvents();
  }

  /**
   * Reusable method to calculate the current amount of
   * content repetitions required for the screen
   *
   * @returns The amount of times the content repeats
   */
  getRepititions() {
    const repetitions = Math.ceil(
      this.tickerHTMLElement.clientWidth / this.content.clientWidth
    );

    this.currentRepetitions = repetitions;

    return repetitions;
  }

  /**
   * Stretch and repeat the content across the width of the slider
   * @param {number} amount The amount of times to clone
   */
  clone(amount: number) {
    // Offset it depending on direction
    this.content.style.transform = `translateX(${-this.content.clientWidth}px)`;

    for (let i = 0; i < amount; i++) {
      const clones = this.content.cloneNode(true) as HTMLElement;
      clones.style.transform = `translateX(${-this.content.clientWidth}px)`;
      this.tickerHTMLElement.append(clones);
    }
  }

  /**
   * Animate the slider based on the width of the content
   */
  animate() {
    /**
     * Wrapper to animate the individual elements consistently
     *
     * @param e The HTML Element to animate
     * @returns An Animation object
     */
    const elementAnimate = (e) => {
      return e.animate(
        [{ transform: `translateX(${this.content.clientWidth}px)` }],
        {
          duration: 10 * this.content.clientWidth, // has to scale with width to keep speed consistent
          iterations: Infinity,
          composite: "add",
        }
      );
    };

    // Setup new animation entirely or update the existing one
    if (!this.animations.length) {
      Array.from(this.tickerHTMLElement.children).forEach((e) => {
        this.animations.push(elementAnimate(e));
      });
    } else {
      Array.from(this.tickerHTMLElement.children).forEach((e) => {
        if (!e.getAnimations().length) {
          this.animations.push(elementAnimate(e));
        } else {
          e.getAnimations()[0].currentTime = 0;
        }
      });
    }
  }

  /**
   * Update the content clones if the screen is bigger.
   */
  refresh() {
    console.log("refresh");
    const previousRepetitions = this.currentRepetitions;

    const delta = this.getRepititions() - previousRepetitions;

    if (delta > 0) {
      this.clone(delta);
      this.animate();
    }
  }

  /**
   * Set up events that should update the slider when occurred
   */
  setupEvents() {
    window.addEventListener(
      "resize",
      debounce(() => {
        this.refresh();
      }, 250)
    );
  }
}
