import { setTranslate } from "@billboard/dom";
import AnimationObject from "./AnimationObject";
import { lerp } from "./Util";

export default class DOMAnimationObject<
    T extends Element
> extends AnimationObject<T> {
    private _position: Position;
    private _destination: Position;
    private _strategy: "default" | "lerp";

    constructor(id: number, ref: T) {
        super(id, ref);

        this._strategy = "default";

        this._position = [-9999, -9999];
        this._destination = [-9999, -9999];
    }

    set strategy(strat: typeof this._strategy) {
        this._strategy = strat;
    }

    get position(): Position {
        return this._position;
    }
    set position(position: Position) {
        this._position = position;
    }

    get destination(): Position {
        return this._destination;
    }
    set destination(dest: Position) {
        this._destination = dest;
    }

    update(dt: DOMHighResTimeStamp, totTime: DOMHighResTimeStamp) {
        if (this._strategy === "default" || this._strategy === "lerp") {
            this._position[0] = lerp(
                this._position[0],
                this._destination[0],
                dt * 0.01
            );
            this._position[1] = lerp(
                this._position[1],
                this._destination[1],
                dt * 0.01
            );
        }
    }

    draw() {
        setTranslate(this.ref, this._position);
    }
}
