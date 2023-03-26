export type ElementOrNode = Node | Element;
export type ElementOrNodeList = NodeList | HTMLCollection;
export type AnyElementOrNode = ElementOrNode | ElementOrNodeList;

function wrappedElement(element: keyof HTMLElementTagNameMap) {
  return function <NodeType extends Node>(
    innerElement: AnyElementOrNode
  ): HTMLElement {
    const wrapperElement = document.createElement(element);

    if (
      innerElement instanceof NodeList ||
      innerElement instanceof HTMLCollection
    ) {
      Array.from(innerElement).forEach((e) => {
        wrapperElement.append(e);
      });
    } else {
      wrapperElement.append(innerElement);
    }

    return wrapperElement;
  };
}

export const wrappedDiv = wrappedElement("div");
export const wrappedSpan = wrappedElement("span");

export function cloneChild(child: ElementOrNode): Node | null {
  const parent = child.parentElement;

  if (parent) {
    const clone = child.cloneNode(true);
    parent.appendChild(clone);

    return clone;
  } else {
    console.error("No parent for child to clone under");

    return null;
  }
}

export function getNumAttribute(element: Element, attr: string): number | null {
  const value = element.getAttribute(attr);
  if (value) return parseInt(value);
  else return null;
}
