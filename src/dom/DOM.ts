export type ElementOrNode = Node | Element;
export type ElementOrNodeList = NodeList | HTMLCollection;
export type AnyElementOrNode = ElementOrNode | ElementOrNodeList;

export function isDOMList(
    elements: AnyElementOrNode
): elements is ElementOrNodeList {
    return elements instanceof NodeList || elements instanceof HTMLCollection;
}

export function manipulateElements(
    elements: AnyElementOrNode,
    target: HTMLElement,
    manipulation: (element: ElementOrNode, target: HTMLElement) => void
): HTMLElement {
    if (elements instanceof NodeList || elements instanceof HTMLCollection) {
        Array.from(elements).forEach((e) => {
            manipulation(e, target);
        });
    } else {
        manipulation(elements, target);
    }

    return target;
}

export function moveElements(elements: AnyElementOrNode, target: HTMLElement) {
    return manipulateElements(elements, target, (e, t) => {
        t.append(e);
    });
}
export function copyElements(elements: AnyElementOrNode, target: HTMLElement) {
    return manipulateElements(elements, target, (e, t) => {
        t.append(e.cloneNode(true));
    });
}

function wrappedElement(element: keyof HTMLElementTagNameMap) {
    return function (
        innerElement: AnyElementOrNode,
        clone?: boolean
    ): HTMLElement {
        const wrapperElement = document.createElement(element);

        if (clone) copyElements(innerElement, wrapperElement);
        else moveElements(innerElement, wrapperElement);

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
