import AnimationController from "./AnimationController";
import PlaybackObject from "./PlaybackObject";

export default abstract class System extends PlaybackObject {
    /**
     * Runs {@link System.onDraw } accounting for playback controls.
     *
     * @see {@link AnimationController.render }
     */
    draw() {
        if (this.status.started && !this.status.paused) {
            this.onDraw();
        }
    }

    /**
     * Runs {@link System.onUpdate } accounting for playback controls.
     *
     * @see {@link AnimationController.render }
     *
     * @param dt the elapsed time between frames in milliseconds (ms)
     * @param t the total time of the running animation in milliseconds (ms)
     */
    update(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
        if (this.status.started && !this.status.paused) {
            this.onUpdate(dt, t);
        }
    }

    /**
     * Hook running per update call in the render loop
     * This should not perform any draw operations that affect what is displayed on the screen.
     * This should only perform updates to logic or data.
     *
     * @param dt The elapsed time between frames in milliseconds (ms)
     * @param t The total time of the running animation in milliseconds (ms)
     */
    abstract onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp): void;

    /**
     * Hook running per draw call in the render loop.
     * This should only perform operations that affect what is displayed on the screen.
     */
    abstract onDraw(): void;
}
