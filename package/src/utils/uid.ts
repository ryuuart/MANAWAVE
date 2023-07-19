/**
 * Generates a lightweight unique ID with a light risk of collision
 * @returns a lightweight unique ID
 */
export function uid() {
    return String(Date.now().toString(32) + Math.random().toString(16)).replace(
        /\./g,
        ""
    );
}
