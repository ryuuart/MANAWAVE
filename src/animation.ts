/**
 * Contains media playback controls for the slider
 */
export class Controls {
  /**
   * Set up tracked animations for controls
   * @param animations the animations to track
   */
  constructor(public animations: Animation[] = []) {}

  /**
   *  Update the tracked animations for the playback controls
   * @param animations The new animations to track
   */
  update(animations) {
    this.animations = animations;
  }

  /**
   * Continue the tracked animations
   */
  play() {
    this.animations.forEach((e) => {
      e.play();
    });
  }

  /**
   * Pause the tracked animations
   */
  pause() {
    this.animations.forEach((e) => {
      e.pause();
    });
  }
}
