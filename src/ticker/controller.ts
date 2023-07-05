import { AnimationController } from "@ouroboros/anim";
import Context, { LiveAttributes, LiveSize } from "./context";
import TickerSystem from "./system";
import PlaybackObject from "@ouroboros/anim/PlaybackObject";

export default class Controller extends PlaybackObject {
    private _context: Context;
    private _system: TickerSystem;

    constructor(context: Context) {
        super();

        this._context = context;
        this._context.onSizeUpdate = this.onResize.bind(this);
        this._context.onAttrUpdate = this.onAttrUpdate.bind(this);

        this._system = new TickerSystem(this._context);

        this.init();

        if (this._context.attributes.autoplay) this._system.play();
    }

    onResize(size: LiveSize) {
        this._system.updateSize(size);
    }

    onAttrUpdate(attr: LiveAttributes) {
        this._system.updateAttributes(attr);
    }

    onPause(): void {
        this._system.pause();
    }

    onPlay(): void {
        this._system.play();
    }

    init() {
        this._system.start();
        this._system.pause();
        AnimationController.registerSystem(this._system);
    }

    deinit() {
        this._system.stop();
        AnimationController.deregisterSystem(this._system);
    }
}
