import WebComponent from "./element";

/**
 * Takes an element with Marquee attributes and extracts its
 * values into a formatted object.
 *
 * @param element element with Marquee attributes
 * @returns Marquee parameters extracted and formatted into an object
 */
export function extractOAttributes(
    element: HTMLElement
): Partial<manawave.Options> {
    const result: Partial<manawave.Options> = {};

    let autoplay, speed, direction;

    // follow web standards if the marquee is a regular element, not custom
    // as in, use data attributes if it's not a custom element
    if (element instanceof WebComponent) {
        autoplay = element.getAttribute("autoplay");
        if (autoplay !== null)
            result.autoplay =
                autoplay.toLowerCase() === "true" || autoplay === "";
        else result.autoplay = element.hasAttribute("autoplay");

        // check speed
        speed = element.getAttribute("speed");

        // check direction
        direction = element.getAttribute("direction");
    } else {
        const autoplay = element.dataset.autoplay;
        if (autoplay !== undefined)
            result.autoplay =
                autoplay.toLowerCase() === "true" || autoplay === "";

        // check speed
        speed = element.dataset.speed;

        // check direction
        direction = element.dataset.direction;
    }

    // shared logic
    if (speed) result.speed = parseFloat(speed);
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
    direction: manawave.Options["direction"]
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
 * @param element element with possible marquee attributes
 * @param options options that would override parameters defined by the attributes
 * @returns formatted marquee options
 */
export function mergeOOptions(
    element: HTMLElement,
    options?: Partial<manawave.Options>
): manawave.Options {
    const currProps: manawave.Options = {
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
    private options: Partial<manawave.Options>;

    private _autoplay: boolean;
    private _speed: number;
    private _direction: string | number;

    // overrideable, and invoked when attribute values are updated
    onUpdate: (values: {
        autoplay: boolean;
        speed: number;
        direction: number;
    }) => void;

    constructor(target: HTMLElement, options: Partial<manawave.Options> = {}) {
        this.target = target;
        this.options = options;
        this._autoplay = false;
        this._speed = 1;
        this._direction = 0;

        this.onUpdate = () => {};

        this.update();

        this.observer = new MutationObserver(this.onElementMutate.bind(this));
        this.observer.observe(target, {
            attributes: true,
            attributeFilter: [
                "speed",
                "direction",
                "autoplay",
                "data-speed",
                "data-direction",
                "data-autoplay",
            ],
        });
    }

    /**
     * Updates the value of the attributes based off current state of the
     * target element and options. You can provide updated options if you want.
     *
     * @param options updates the current overriding options
     */
    update(options?: Partial<manawave.Options>) {
        this.options = { ...this.options, ...options };
        const values = mergeOOptions(this.target, this.options);

        this._autoplay = values.autoplay;
        this._speed = values.speed;
        this._direction = values.direction;

        this.onUpdate({
            autoplay: this.autoplay,
            speed: this.speed,
            direction: this.direction,
        });
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
