import Wiring from "./Wiring";

import { animate } from "motion";
export default class BillboardTicker extends HTMLElement {
  wires: Wiring;
  content: HTMLElement;

  constructor() {
    super();

    this.classList.add("billboard-ticker");
    const styles = document.createElement("style");
    document.head.appendChild(styles);
    styles.sheet?.insertRule(`
        .billboard-ticker {
            display: block;
            white-space: nowrap;
            position: relative;
            overflow: hidden;
        }
    `);
    styles.sheet?.insertRule(`
        .billboard-ticker > .container-wrapper > .row > div {
            display: inline-block;
        }
    `);
    styles.sheet?.insertRule(`
        .billboard-ticker > .container-wrapper {
          overflow: hidden;
        }
    `);
    styles.sheet?.insertRule(`
        .billboard-ticker > .container-wrapper > .row {
            display: flow-root;
            position: relative;
        }
    `);

    this.content = document.createElement("div");
    Array.from(this.children).forEach((element) => {
      this.content.appendChild(element);
    });

    this.wires = new Wiring(this, this.content);

    let angle = -(0 * Math.PI) / 4;
    let directionVector = [Math.cos(angle), Math.sin(angle)];
    let magnitude = [
      this.wires.dimensions.content.width,
      this.wires.dimensions.content.height,
    ];

    animate(
      this.querySelectorAll(".container-wrapper > .row > div"),
      {
        transform: `translate(${
          Math.sign(Math.round(directionVector[0])) * magnitude[0]
        }px, ${Math.sign(Math.round(directionVector[1])) * magnitude[1]}px)`,
      },
      { duration: 0.5, easing: "linear", repeat: Infinity }
    );
  }

  connectedCallback() {
    // TODO: Add stuff
  }
}
