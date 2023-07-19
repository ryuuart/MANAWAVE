/**
 * Tests deep equivalence between two rects
 * @param r1 rect
 * @param r2 rect
 * @returns if r1 equals r2
 */
export function isRectEqual(r1: Rect, r2: Rect): boolean {
    return r1.width === r2.width && r1.height === r2.height;
}
