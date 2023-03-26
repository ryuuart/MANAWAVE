import { AnimationControls } from "motion";
import { setX, translateX } from "./animation";
import dimensions from "./dimensions";

export default class TickerElement {
  element: Element;
  position: [x: number, y: number];
  animation: AnimationControls;
  id: number;

  constructor(
    element: Element,
    id: number,
    position: [x: number, y: number] = [0, 0]
  ) {
    this.element = element;

    this.id = id;
    this.element.setAttribute("data-id", `${id}`);

    this.position = position;
  }

  animate() {
    this.position[0] += dimensions.TICKER_ELEMENT_WIDTH;
    this.animation = translateX(this.element, this.position[0], (value) => {
      this.animate();
    });
  }

  listen(event: string) {
    switch (event) {
      case "update":
        this.onUpdate();
        break;
      case "loop":
        this.onLoop();
        break;
    }
  }

  onUpdate() {}

  onLoop() {
    this.animation.finished.then(() => {
      this.position[0] = 0;
      setX(this.element, this.position[0]);
    });
  }
}
