/**
 * Takes an element with Ticker attributes and extracts its
 * values into a formatted object.
 *
 * @param element element with Ticker attributes
 * @returns Ticker parameters extracted and formatted into an object
 */
export function extractOAttributes(
    element: HTMLElement
): Partial<Ouroboros.Options> {
    const result: Partial<Ouroboros.Options> = {};

    const autoplay = element.getAttribute("autoplay");
    if (autoplay) result.autoplay = autoplay.toLowerCase() === "true";
    else result.autoplay = element.hasAttribute("autoplay");

    // check speed
    const speed = element.getAttribute("speed");
    if (speed) result.speed = parseFloat(speed);

    // check direction
    const direction = element.getAttribute("direction");
    if (direction) {
        result.direction = direction;
    }

    return result;
}

/**
 * Converts a direction string to angle degrees
 * @param direction the direction in string format
 * @returns the direction in angle degrees
 */
export function convertDirection(
    direction: Ouroboros.Options["direction"]
): number {
    if (typeof direction === "number") return direction;

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
 * Takes options from HTML and JS sources to merge them together. JS sources take precedence.
 * @param element element with possible ticker attributes
 * @param options options that would override parameters defined by the attributes
 * @returns formatted ticker options
 */
export function mergeOOptions(
    element: HTMLElement,
    options?: Partial<Ouroboros.Options>
): Ouroboros.Options {
    const currProps: Ouroboros.Options = {
        autoplay: false,
        speed: 1,
        direction: 0,
    };

    // assign from attributes
    Object.assign(currProps, extractOAttributes(element));

    // js takes highest priority in terms of resolution
    if (options) Object.assign(currProps, options);

    return currProps;
}
