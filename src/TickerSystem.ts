import TickerElement from "./TickerElement";

class TickerSystem {
  //   tickerElements: { [index: number]: TickerElement };
  tickerElements: Map<number, TickerElement> = new Map();
  tickerElementBelt: TickerElement[];
  tags: Map<string, Set<TickerElement>> = new Map();

  idCounter = 0;

  observer: IntersectionObserver;

  constructor() {
    this.tickerElementBelt = [];
  }

  register(element: Element, position: [number, number]) {
    const id = this.idCounter++; // tmp

    const tickerElement = new TickerElement(element, id, position);
    this.tickerElements.set(id, tickerElement);
    this.tickerElementBelt.push(tickerElement);
  }

  add(element: Element, position: [number, number], animate?: boolean) {
    const id = this.idCounter++;

    const tickerElement = new TickerElement(element, id, position);
    this.tickerElements.set(id, tickerElement);
    this.tickerElementBelt.unshift(tickerElement);

    if (animate) tickerElement.animate();
  }

  remove(elementOrId: Element | number) {
    const tickerElement = this.get(elementOrId);

    if (tickerElement) {
      tickerElement.tags.forEach((tag) => {
        this.tags.get(tag)?.delete(tickerElement);
      });
      this.tickerElementBelt.splice(
        this.tickerElementBelt.indexOf(tickerElement),
        1
      );
      this.tickerElements.delete(tickerElement.id);
      tickerElement.element.remove();
    }
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

  message(event: string, element: Element) {
    const tickerElement = this.get(element);
    tickerElement?.listen(event);
  }

  notify(event: string) {}

  start(observer: IntersectionObserver) {
    this.observer = observer;
    this.tickerElements.forEach((element) => {
      element.animate();
    });
  }

  hasTag(elementOrId: Element | number, tag: string): boolean {
    const tickerElement = this.get(elementOrId);

    if (tickerElement) {
      const tickerElementHasTag = tickerElement.tags.has(tag);
      const tickerSystemHasTag = this.tags.has(tag);
      const tickerSystemElementsHasTag = tickerElement.tags.has(tag);

      return (
        tickerElementHasTag && tickerSystemHasTag && tickerSystemElementsHasTag
      );
    }

    return false;
  }

  getTagElements(tag: string): TickerElement[] | null {
    const tagElements = this.tags.get(tag);
    if (tagElements) {
      return Array.from(tagElements);
    } else {
      console.error("Tag not found while getting tag element.");
      return null;
    }
  }

  addTag(elementOrId: Element | number, tag: string): void {
    const tickerElement = this.get(elementOrId);

    if (!this.tags.has(tag)) {
      this.tags.set(tag, new Set());
    }

    const tagElementList = this.tags.get(tag);

    if (tickerElement) {
      tickerElement.tags.add(tag);
      tagElementList?.add(tickerElement);
    }
  }

  removeTag(elementOrId: Element | number, tag: string): void {
    const tickerElement = this.get(elementOrId);

    if (!this.tags.has(tag)) {
      console.error("Tag not found");
      return;
    }

    const tagElementList = this.tags.get(tag);

    if (tickerElement)
      if (!tagElementList?.delete(tickerElement)) {
        console.error("Failed to remove tag");
      } else {
        tickerElement.tags.delete(tag);
      }
  }
}

export default new TickerSystem();
