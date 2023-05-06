export default class AnimationController {
    private _animObjects: Billboard.AnimationObject<any>[];

    private _isPaused: boolean;
    private _hasStarted: boolean;

    private _renderID: number | undefined;

    private _currentTime: DOMHighResTimeStamp;
    private _totalTime: DOMHighResTimeStamp;
    private _targetDT: number; // Target Delta Time

    constructor() {
        this._animObjects = [];

        this._hasStarted = false;
        this._isPaused = false;

        this._currentTime = window.performance.now();
        this._totalTime = 0;
        this._targetDT = 1 / 60.0;
    }

    addAnimation<T>(object: Billboard.AnimationObject<T>) {
        this._animObjects.push(object);
    }

    start() {
        if (!this._hasStarted) {
            this._hasStarted = true;

            this._totalTime = 0;
            this._currentTime = window.performance.now();

            this._renderID = window.requestAnimationFrame(
                this.render.bind(this)
            );
        }
    }

    stop() {
        if (this._hasStarted && this._renderID) {
            this._isPaused = false;
            this._hasStarted = false;

            window.cancelAnimationFrame(this._renderID);
        }
    }

    play() {
        if (this._hasStarted && this._isPaused) {
            this._isPaused = false;
        }
    }

    pause() {
        if (this._hasStarted && !this._isPaused) {
            this._isPaused = true;
        }
    }

    render(timestamp: DOMHighResTimeStamp) {
        let newTime = timestamp;
        let frameTime = newTime - this._currentTime;
        this._currentTime = newTime;

        // if time has progressed
        while (frameTime > 0.0) {
            // if you're lagging, use the frame time
            // if you're running super fast, sync to the fixed time
            let dt = Math.min(frameTime, this._targetDT);

            // Update the overall system
            for (const animObject of this._animObjects) {
                animObject.update(dt, this._totalTime);
            }

            // Render
            for (const animObject of this._animObjects) {
                animObject.draw();
            }

            // step once
            frameTime -= dt;

            this._totalTime += dt;
        }

        window.requestAnimationFrame(this.render.bind(this));
    }
}
