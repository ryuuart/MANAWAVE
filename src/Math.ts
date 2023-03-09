export type vec2 = [number, number];

/**
 * Calculate and get the amount of repetitions a Billboard container
 * needs to repeat the inner element within the container.
 *
 * @param {number} containerWidth width of root container
 * @param {number} contentWidth width of a repeatable instance (whatever is under the wrapper root)
 * @returns {number} The amount of repetitions the element can repeat in the Billboard
 */
export function getContentRepetitions(
  containerWidth: number,
  contentWidth: number
): number {
  const repetitions = Math.ceil(containerWidth / contentWidth) + 4;

  return repetitions;
}

/**
 * Convert degrees to Radians
 *
 * @param degrees Mathematical degrees (out of 360)
 * @returns degrees in Radians
 */
export function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
