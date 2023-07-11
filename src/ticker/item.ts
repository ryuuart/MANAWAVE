import { uid } from "@manawave/utils/uid";
import { normalize } from "./math";

export class Item implements Positionable {
    id: string;
    lifetime: DOMHighResTimeStamp;
    position: vec2;
    size: Rect;

    constructor(position?: vec2, size?: Rect) {
        this.lifetime = 0;
        this.position = {
            x: 0,
            y: 0,
        };
        this.size = {
            width: 0,
            height: 0,
        };

        if (position) this.position = position;
        if (size) this.size = size;

        this.id = uid();
    }

    /**
     * Moves an item towards somewhere.
     * @param direction direction to move
     * @param speed how fast or strongly the item should move
     */
    move(direction: vec2, speed: number) {
        // directions should not have any magnitude and should be normalized
        const normalizedDirection = normalize(direction);

        this.position.x += 1 * speed * normalizedDirection.x;
        this.position.y += 1 * speed * normalizedDirection.y;
    }

    /**
     * This will loop (change the position) an {@link Item} from one end to the other end
     * of a rectangle. In more technical terms, it adjusts the position of
     * an {@link Item} to fit inside the rectangle, looping the item to fit it in.
     * @param limits the rectangle to loop around
     * @param direction the actual direction / motion of the item
     */
    loop(limits: BoundingBox, direction: vec2) {
        if (direction.x > 0 && this.position.x >= limits.right) {
            this.position.x = limits.left;
        } else if (direction.x < 0 && this.position.x <= limits.left) {
            this.position.x = limits.right;
        }
        if (direction.y > 0 && this.position.y >= limits.bottom) {
            this.position.y = limits.top;
        } else if (direction.y < 0 && this.position.y <= limits.top) {
            this.position.y = limits.bottom;
        }
    }
}
