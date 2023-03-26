import { getNumAttribute } from "./dom";

export function getXAttr(element: Element): number | null {
  const value = getNumAttribute(element, "x");

  if (value !== null) return value;
  else {
    console.error(element, " does not have x attribute.");
    return null;
  }
}
