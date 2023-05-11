interface AnimationPlayerCallbacks {
    start?: () => void;
    pause?: () => void;
    play?: () => void;
    stop?: () => void;
}

export default class AnimationPlayer {
    private _isPaused: boolean;
    private _hasStarted: boolean;

    private startCallback: undefined | (() => void);
    private pauseCallback: undefined | (() => void);
    private playCallback: undefined | (() => void);
    private stopCallback: undefined | (() => void);

    constructor(playerCallbacks?: AnimationPlayerCallbacks) {
        this._hasStarted = false;
        this._isPaused = false;

        if (playerCallbacks) {
            const { start, pause, play, stop } = playerCallbacks;
            if (start) this.startCallback = start;
            if (pause) this.pauseCallback = pause;
            if (play) this.playCallback = play;
            if (stop) this.stopCallback = stop;
        }
    }

    get status() {
        return {
            started: this._hasStarted,
            paused: this._isPaused,
        };
    }

    start(callback?: () => void) {
        if (!this._hasStarted) {
            this._hasStarted = true;

            if (this.startCallback) this.startCallback();
            if (callback) callback();
        }
    }

    stop(callback?: () => void) {
        if (this._hasStarted) {
            this._isPaused = false;
            this._hasStarted = false;

            if (this.stopCallback) this.stopCallback();
            if (callback) callback();
        }
    }

    play(callback?: () => void) {
        if (this._hasStarted && this._isPaused) {
            this._isPaused = false;

            if (this.playCallback) this.playCallback();
            if (callback) callback();
        }
    }

    pause(callback?: () => void) {
        if (this._hasStarted && !this._isPaused) {
            this._isPaused = true;

            if (this.pauseCallback) this.pauseCallback();
            if (callback) callback();
        }
    }
}
