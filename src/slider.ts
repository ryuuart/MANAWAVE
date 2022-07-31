import anime from "animejs";

/**
 * The HTML Slider that Billboard sets up and manipulates
 */
export default class Slider {
  tickerHTMLElement: HTMLElement;
  tickerItems: NodeList;
  content: HTMLElement;
  contentBoundingBox: DOMRect;

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

    this.clone();
  }

  /**
   * Stretch and repeat the content across the width of the slider
   */
  clone() {
    // Calculate the number of repetitions needed
    const repetitions = Math.ceil(
      this.tickerHTMLElement.clientWidth / this.content.clientWidth
    );

    // Offset it depending on direction
    this.content.style.transform = `translateX(${-this.content.clientWidth}px)`;

    for (let i = 0; i < repetitions; i++) {
      const clones = this.content.cloneNode(true) as HTMLElement;
      clones.style.transform = `translateX(${-this.content.clientWidth}px)`;
      this.tickerHTMLElement.append(clones);
    }
  }

  /**
   * Animate the slider based on the width of the content
   */
  animate() {
    anime({
      targets: this.tickerHTMLElement.children,
      translateX: `+=${this.content.clientWidth}`,
      easing: "linear",
      duration: 10 * this.content.clientWidth, // has to scale with width to keep speed consistent
      loop: true,
    });
  }
}
