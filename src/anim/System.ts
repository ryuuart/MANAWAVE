import PlaybackObject from "@billboard/anim/PlaybackObject";

export default abstract class System extends PlaybackObject {
    draw() {
        if (this.status.started && !this.status.paused) {
            this.onDraw();
        }
    }

    update(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
        if (this.status.started && !this.status.paused) {
            this.onUpdate(dt, t);
        }
    }

    abstract onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp): void;

    abstract onDraw(): void;
}
