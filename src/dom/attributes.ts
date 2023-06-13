import { OptionalOuroborosOptions } from "@ouroboros/ouroboros";
import { TickerStateData } from "@ouroboros/ticker/state";

/**
 * Takes an element with Ticker attributes and extracts its
 * values into a formatted object.
 *
 * @param element element with Ticker attributes
 * @returns ticker parameters converted to primitive values
 */
export function fromTAttributes(element: HTMLElement) {
    const result: {
        autoplay?: TickerStateData["autoplay"];
        speed?: TickerStateData["speed"];
        direction?: TickerStateData["direction"];
    } = {};

    // check autoplay
    result.autoplay = element.hasAttribute("autoplay");

    // check speed
    const speed = element.getAttribute("speed");
    if (speed) result.speed = parseFloat(speed);

    // check direction
    const direction = element.getAttribute("direction");
    if (direction) {
        result.direction = convertDirection(direction);
    }

    return result;
}

/**
 * Converts a direction string to angle degrees
 * @param direction the direction in string format
 * @returns the direction in angle degrees
 */
export function convertDirection(direction: string): number {
    let result = 0;

    const lowerCaseDirection = direction.toLocaleLowerCase();
    switch (lowerCaseDirection) {
        case "up":
            result = 90;
            break;
        case "right":
            result = 0;
            break;
        case "down":
            result = 270;
            break;
        case "left":
            result = 180;
            break;
        default:
            result = parseFloat(lowerCaseDirection);
            if (!result) result = 0;
    }

    return result;
}

/**
 * Generates formattted ticker options with override.
 * @param element element with possible ticker attributes
 * @param options options that would override parameters defined by the attributes
 * @returns formatted ticker options
 */
export function generateTOptions(
    element: HTMLElement,
    options?: OptionalOuroborosOptions
) {
    const currOptions = {
        autoplay: false,
        speed: 1,
        direction: 0,
    };

    // assign from attributes
    Object.assign(currOptions, fromTAttributes(element));

    // js takes highest priority in terms of resolution
    if (options) Object.assign(currOptions, options);

    return currOptions;
}
