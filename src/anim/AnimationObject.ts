export default class AnimationObject<T> {
    private _id: number;
    private _ref: T;

    constructor(id: number, ref: T) {
        this._id = id;
        this._ref = ref;
    }

    get id(): number {
        return this._id;
    }

    get ref(): T {
        return this._ref;
    }

    update(dt: DOMHighResTimeStamp, totTime: DOMHighResTimeStamp) {}

    draw() {}
}
