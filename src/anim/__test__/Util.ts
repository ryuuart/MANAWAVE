export type Position = [number, number];
export function setTranslate(element: Element, position: [number, number]) {
    const htmlElement = element as HTMLElement;
    htmlElement.style.transform = `translate(${position[0]}px, ${position[1]}px)`;
}

export function lerp(v0: number, v1: number, t: number) {
    return v0 * (1 - t) + v1 * t;
}
