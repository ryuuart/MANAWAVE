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

/**
 * Represents the current attributes of the system at any point in time.
 */
export class Attributes {
    private observer: MutationObserver;
    private target: HTMLElement;
    private options: Partial<Ouroboros.Options>;

    private _autoplay: boolean;
    private _speed: number;
    private _direction: string | number;

    constructor(target: HTMLElement, options: Partial<Ouroboros.Options> = {}) {
        this.target = target;
        this.options = options;
        this._autoplay = false;
        this._speed = 1;
        this._direction = 0;

        this.update();

        this.observer = new MutationObserver(this.onElementMutate.bind(this));
        this.observer.observe(target, {
            attributes: true,
            attributeFilter: ["speed", "direction", "autoplay"],
        });
    }

    /**
     * Updates the value of the attributes based off current state of the
     * target element and options. You can provide updated options if you want.
     *
     * @param options updates the current overriding options
     */
    update(options?: Partial<Ouroboros.Options>) {
        this.options = { ...this.options, ...options };
        const values = mergeOOptions(this.target, this.options);

        this._autoplay = values.autoplay;
        this._speed = values.speed;
        this._direction = values.direction;
    }

    get speed(): number {
        return this._speed;
    }

    get autoplay(): boolean {
        return this._autoplay;
    }

    get direction(): number {
        return convertDirection(this._direction);
    }

    /**
     * Hook that updates the attribute values if there are changes in
     * the target element attributes.
     * @param mutations all attribute changes for the target element
     */
    private onElementMutate(mutations: MutationRecord[]) {
        for (const mutation of mutations) {
            if (mutation.type === "attributes") {
                this.update();
            }
        }
    }
}
