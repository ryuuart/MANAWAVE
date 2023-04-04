import { AnimationControls } from "motion";
import { setX, translateX } from "./animation";
import BillboardTicker from "./BillboardTicker";
import dimensions from "./dimensions";
import { cloneChild } from "./dom";
import TickerSystem from "./TickerSystem";

export default class TickerElement {
  element: Element;
  position: [x: number, y: number];
  animation: AnimationControls;
  loopPosition: number;
  tags: Set<string> = new Set();
  id: number;

  magnitude: [x: number, y: number];

  tmpKeyEventFunc: (ev: KeyboardEvent) => any;

  constructor(
    element: Element,
    id: number,
    position: [x: number, y: number] = [0, 0]
  ) {
    this.element = element;

    this.id = id;
    this.element.setAttribute("data-id", `${id}`);

    this.position = position;
    setX(this.element, this.position[0]);

    this.loopPosition = Math.round(
      this.position[0] / dimensions.TICKER_ELEMENT_WIDTH
    );
  }

  animate() {
    // this.position[0] += dimensions.TICKER_ELEMENT_WIDTH;
    // this.animation = translateX(this.element, this.position[0], (value) => {
    //   if (this.loopPosition >= 2 && TickerSystem.hasTag(this.id, "first")) {
    //     TickerSystem.removeTag(this.id, "first");
    //   }
    //   this.animate();
    // });
    this.tmpKeyEventFunc = (event) => {
      if (event.key === "ArrowRight") {
        this.loopPosition++;
        this.position[0] += dimensions.MAGNITUDE[0];
        if (this.loopPosition >= 2 && TickerSystem.hasTag(this.id, "first")) {
          TickerSystem.removeTag(this.id, "first");
        }
        setX(this.element, this.position[0]);
      }
    };

    window.addEventListener("keydown", this.tmpKeyEventFunc);
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
    let newPosition;
    do {
      const newNode = cloneChild(this.element);
      newPosition =
        TickerSystem.tickerElementBelt[0].position[0] -
        dimensions.TICKER_ELEMENT_WIDTH;
      TickerSystem.add(newNode as Element, [newPosition, 0], true);
      TickerSystem.observer.observe(newNode as Element);
      console.log(TickerSystem.tickerElementBelt);
    } while (newPosition > 0);
    TickerSystem.observer.unobserve(this.element);
    window.removeEventListener("keydown", this.tmpKeyEventFunc);
    TickerSystem.remove(this.element);
    // this.animation.finished.then(() => {
    //   const tagElements = TickerSystem.getTagElements("first");
    //   if (tagElements) {
    //     const firstElement = tagElements[0];
    //     firstElement.animation.finished.then(() => {
    //       this.loopPosition = 0;
    //       this.position[0] =
    //         firstElement.position[0] - 2 * dimensions.MAGNITUDE[0];
    //       // this.position[0] =
    //       //   firstElement.position[0] - dimensions.TICKER_ELEMENT_WIDTH;
    //       setX(this.element, this.position[0]);
    //       TickerSystem.addTag(this.id, "first");
    //     })
    //   }
    // });
  }
}
