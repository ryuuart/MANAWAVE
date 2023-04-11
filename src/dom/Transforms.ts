export function setTranslate(element: Element, position: [number, number]) {
  const htmlElement = element as HTMLElement;
  htmlElement.style.transform = `translate(${position[0]}px, ${position[1]}px)`;
}
