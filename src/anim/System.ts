import PlaybackObject from "@billboard/anim/PlaybackObject";

export default abstract class System extends PlaybackObject {
    abstract update(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp): void;
    abstract draw(): void;
}
