/**
 * Converts degrees to radians
 * @param degrees the angle in degrees
 * @returns the angle in radians
 */
export function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/**
 * Normalizes a vector to a magnitude of 1
 * @param vector a vector of numbers
 * @returns the vector that is normalized to a magnitude of 1
 */
export function normalize(vector: vec2): vec2 {
    const x = vector.x / Math.sqrt(vector.x ** 2 + vector.y ** 2);
    const y = vector.y / Math.sqrt(vector.x ** 2 + vector.y ** 2);

    return { x, y };
}

/**
 * Accumulates changes to a vector over time using functions
 *
 * @param start the starting vector value
 * @returns a function that allows you to accumulate changes to the start
 */
export function accumulateVec2(start: vec2) {
    const total = { x: start.x, y: start.y };

    return function accumulate(delta: vec2) {
        total.x += delta.x;
        total.y += delta.y;

        return total;
    };
}

/**
 * Converts an angle to a direction vector
 * @param angle in degrees
 * @returns the angle converted to a direction vector
 */
export function angleToDirection(angle: number): vec2 {
    return {
        x: Math.cos(toRadians(angle)),
        y: -Math.sin(toRadians(angle)),
    };
}
