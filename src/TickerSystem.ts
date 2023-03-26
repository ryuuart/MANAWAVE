import TickerElement from "./TickerElement";

class TickerSystem {
  //   tickerElements: { [index: number]: TickerElement };
  tickerElements: Map<number, TickerElement>;

  idCounter = 0;

  constructor() {
    this.tickerElements = new Map();
  }

  register(element: Element, position: [number, number]) {
    const id = this.idCounter++; // tmp

    this.tickerElements.set(id, new TickerElement(element, id, position));
  }

  notify(event: string) {}

  get(element: Element): TickerElement | null {
    const idAttrib = element.getAttribute("data-id");
    if (idAttrib) {
      const tickerElement = this.tickerElements.get(parseInt(idAttrib));
      if (tickerElement) return tickerElement;
      else {
        console.error("Element not registered.");
        return null;
      }
    } else {
      console.error("ID Data is missing.");
      return null;
    }
  }

  message(event: string, element: Element) {
    const tickerElement = this.get(element);
    tickerElement?.listen(event);
  }

  start() {
    this.tickerElements.forEach((element) => {
      element.animate();
    });
  }
}

export default new TickerSystem();
