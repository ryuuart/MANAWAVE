import { toRadians, vec2 } from "./Math";
import { animate } from "motion";
import BillboardState from "./State";
export default class Animation {
  directionVector: vec2;
  magnitude: vec2;
  speed: number;

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
