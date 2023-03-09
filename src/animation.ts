import { toRadians, vec2 } from "./Math";
import { animate } from "motion";
import BillboardState from "./State";

/**
 * Controls anything animatable in the Billboard
 */
export default class Animation {
  directionVector: vec2;
  magnitude: vec2;
  speed: number;

  /**
   * @param state the data model that represents the properties and status of the Billboard
   */
  constructor(state: BillboardState) {
    // TODO: Update to more general state
    this.directionVector = [
      Math.cos(-toRadians(state.data.direction)),
      Math.sin(-toRadians(state.data.direction)),
    ];

    this.magnitude = [
      state.data.dimensions.contentWidth,
      state.data.dimensions.contentHeight,
    ];

    this.speed = state.data.speed;
  }

  /**
   * Animate the Billboard
   * @param animationRoot base `HTMLElement` as a base to find whatever needs to be animated (repeated)
   */
  animate(animationRoot: HTMLElement) {
    animate(
      animationRoot.querySelectorAll(".container-wrapper > .row > div"), // TODO: Generalize Equation
      {
        transform: `translate(${
          Math.round(this.directionVector[0]) * this.magnitude[0]
        }px, ${Math.round(this.directionVector[1]) * this.magnitude[1]}px)`,
      },
      { duration: this.speed, easing: "linear", repeat: Infinity }
    );
  }
}
