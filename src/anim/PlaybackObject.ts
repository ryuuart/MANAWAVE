/**
 * Represents an object that should have playback controls
 */
export default abstract class PlaybackObject {
    private _isPaused: boolean;
    private _hasStarted: boolean;

    /**
     * By default, playback is stopped and paused
     */
    constructor() {
        this._hasStarted = false;
        this._isPaused = false;
    }

    /**
     * @returns Current playback status
     */
    get status() {
        return {
            started: this._hasStarted,
            paused: this._isPaused,
        };
    }

    /**
     * Start the playback
     *
     * @see {@link PlaybackObject.stop }
     */
    start() {
        if (!this._hasStarted) {
            this._hasStarted = true;

            this.onStart();
        }
    }

    /**
     * Stop the playback
     *
     * @see {@link PlaybackObject.start }
     */
    stop() {
        if (this._hasStarted) {
            this._isPaused = false;
            this._hasStarted = false;

            this.onStop();
        }
    }

    /**
     * Continue the playback if it's been paused. Will not start the playback.
     *
     * @see {@link PlaybackObject.start }
     * @see {@link PlaybackObject.pause }
     */
    play() {
        if (this._hasStarted && this._isPaused) {
            this._isPaused = false;

            this.onPlay();
        }
    }

    /**
     * Pause the playback if it's started or playing. It will not stop the playback nor start it.
     *
     * @see {@link PlaybackObject.start }
     * @see {@link PlaybackObject.stop }
     * @see {@link PlaybackObject.play }
     */
    pause() {
        if (this._hasStarted && !this._isPaused) {
            this._isPaused = true;

            this.onPause();
        }
    }

    /**
     * Hook invoked when playback started
     */
    onStart() {}

    /**
     * Hook invoked when playback paused
     */
    onPause() {}

    /**
     * Hook invoked when playback continued
     */
    onPlay() {}

    /**
     * Hook invoked when playback stopped
     */
    onStop() {}
}
