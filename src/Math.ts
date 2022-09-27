export type vec2 = [number, number];

export function getContentRepetitions(
  containerWidth: number,
  contentWidth: number
): number {
  const repetitions = Math.ceil(containerWidth / contentWidth) + 4;

  return repetitions;
}

export function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
