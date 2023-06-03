/**
 * Converts degrees to radians
 * @param degrees the angle in degrees
 * @returns the angle in radians
 */
export function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

export function normalize(vector: vec2): vec2 {
    const x = vector.x / Math.sqrt(vector.x ** 2 + vector.y ** 2);
    const y = vector.y / Math.sqrt(vector.x ** 2 + vector.y ** 2);

    return { x, y };
}

export function accumulateVec2(start: vec2) {
    const total = { x: start.x, y: start.y };

    return function accumulate(delta: vec2) {
        total.x += delta.x;
        total.y += delta.y;

        return total;
    };
}
