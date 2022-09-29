import { toRadians, vec2 } from "./Math";
import { animate } from "motion";
import BillboardState from "./State";

const PRECISION = 2;
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
    const rows = animationRoot.querySelectorAll(".row");

    const widthStart = parseInt(
      (rows[0] as HTMLElement).style.left.slice(0, -2)
    );
    const heightStart = parseInt(
      (rows[0] as HTMLElement).style.top.slice(0, -2)
    );
    let upperDirection = 1;
    let lowerDirection = 1;

    if (
      Math.sign(this.directionVector[0]) > 0 &&
      Math.sign(this.directionVector[1]) < 0
    ) {
      lowerDirection = -1;
      upperDirection = 1;
    }

    if (
      Math.sign(this.directionVector[0]) < 0 &&
      Math.sign(this.directionVector[1]) > 0
    ) {
      lowerDirection = 1;
      upperDirection = 1;
    }

    if (
      Math.sign(this.directionVector[0]) > 0 &&
      Math.sign(this.directionVector[1]) > 0
    ) {
      upperDirection = -1;
      lowerDirection = 1;
    }

    (rows[0] as HTMLElement).style.left = `${
      widthStart +
      upperDirection *
        Math.sign(this.directionVector[0]) *
        parseFloat(this.directionVector[0].toFixed(PRECISION)) *
        this.magnitude[0]
    }px`;
    (rows[2] as HTMLElement).style.left = `${
      widthStart +
      lowerDirection *
        Math.sign(this.directionVector[0]) *
        parseFloat(this.directionVector[0].toFixed(PRECISION)) *
        this.magnitude[0]
    }px`;

    animate(
      animationRoot.querySelectorAll(".container-wrapper > .row > div"), // TODO: Generalize Equation
      {
        transform: `translate(${
          parseFloat(this.directionVector[0].toFixed(PRECISION)) *
          this.magnitude[0]
        }px, ${
          parseFloat(this.directionVector[1].toFixed(0)) * this.magnitude[1]
        }px)`,
      },
      { duration: this.speed, easing: "linear", repeat: Infinity }
    );
  }
}
