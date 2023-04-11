import TickerElement from "../TickerElement";

export default class Registry {
  tickerElements: Map<number, TickerElement> = new Map();
  idCounter = 0;

  register(element: Element, position: [number, number]) {
    const id = this.idCounter++; // tmp

    const tickerElement = new TickerElement(element, id, position);
    this.tickerElements.set(id, tickerElement);
  }

  getId(element: Element): number {
    let id;

    const idAttrib = element.getAttribute("data-id");
    if (idAttrib) id = parseInt(idAttrib);

    return id;
  }

  get(elementOrID: Element | number): TickerElement | null {
    let id;
    if (elementOrID instanceof Element) {
      id = this.getId(elementOrID);
    } else id = elementOrID;

    if (id || id !== undefined) {
      const tickerElement = this.tickerElements.get(id);
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
}
