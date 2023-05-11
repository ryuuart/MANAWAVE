import AnimationPlayer from "@billboard/anim/AnimationPlayer";

export default abstract class System {
    protected animation: { player: AnimationPlayer };

    constructor() {
        this.animation = {
            player: new AnimationPlayer({
                start: this.start.bind(this),
                pause: this.pause.bind(this),
                play: this.play.bind(this),
                stop: this.stop.bind(this),
            }),
        };
    }

    start() {}
    pause() {}
    play() {}
    stop() {}

    abstract update(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp): void;
    abstract draw(): void;
}
