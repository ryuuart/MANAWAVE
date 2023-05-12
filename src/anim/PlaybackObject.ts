export default abstract class PlaybackObject {
    private _isPaused: boolean;
    private _hasStarted: boolean;

    constructor() {
        this._hasStarted = false;
        this._isPaused = false;
    }

    get status() {
        return {
            started: this._hasStarted,
            paused: this._isPaused,
        };
    }

    start() {
        if (!this._hasStarted) {
            this._hasStarted = true;

            this.onStart();
        }
    }

    stop() {
        if (this._hasStarted) {
            this._isPaused = false;
            this._hasStarted = false;

            this.onStop();
        }
    }

    play() {
        if (this._hasStarted && this._isPaused) {
            this._isPaused = false;

            this.onPlay();
        }
    }

    pause() {
        if (this._hasStarted && !this._isPaused) {
            this._isPaused = true;

            this.onPause();
        }
    }

    onStart() {}

    onPause() {}

    onPlay() {}

    onStop() {}
}
