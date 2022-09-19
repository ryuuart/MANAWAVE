import { Slider, SliderOptions } from "./slider";
import BillboardTicker from "./Billboard";

type BillboardOptions = {} & SliderOptions;

/**
 * The main class used to set up the Billboard all in one spot
 */
export default class Billboard {
  slider: Slider;

  /**
   * Set up, configure, and control the overall Billboard system
   * @param {string} id the ID we use to select for the main slider
   * @param {string} options the options provided for the overall Billboard system
   */
  constructor(
    public id: string = "billboard",
    public options: BillboardOptions
  ) {
    this.slider = new Slider(this.id, this.options);

    if (!customElements.get("billboard-ticker")) {
      customElements.define("billboard-ticker", BillboardTicker);
    }
  }

  init() {
    this.slider.setup();
  }

  destroy() {
    this.slider.destroy();
  }

  /**
   * Continue the animations
   */
  play() {
    this.slider.playback.play();
  }

  /**
   * Pause the animations
   */
  pause() {
    this.slider.playback.pause();
  }
}
