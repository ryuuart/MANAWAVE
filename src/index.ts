import Slider from "./slider";

/**
 * The main class used to set up the Billboard all in one spot
 */
export default class Billboard {
  slider: Slider;

  /**
   * Set up, configure, and control the overall Billboard system
   * @param {string} id the ID we use to select for the main slider
   */
  constructor(public id: string = "billboard") {
    this.slider = new Slider(id);
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
