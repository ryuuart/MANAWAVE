import { AnimationController } from "@manawave/anim";
import Context, { LiveAttributes, LiveSize } from "./context";
import System from "./system";
import PlaybackObject from "@manawave/anim/PlaybackObject";
import Pipeline from "./pipeline";

export default class Controller extends PlaybackObject {
    private _context: Context;
    private _system: System;

    constructor(context: Context) {
        super();

        this._context = context;
        this._context.onSizeUpdate = this.onResize.bind(this);
        this._context.onAttrUpdate = this.onAttrUpdate.bind(this);

        this._system = new System(this._context);

        this.start();
    }

    /**
     * Sets the hook to be called when layout occurs
     * @param callback callback invoked when layout occurs
     */
    setOnLayout(callback: Pipeline["_onLayout"]) {
        this._context.onLayout = callback;
        this.forceUpdate();
    }

    /**
     * Forcibly re-fill / re-layout the system regardless of playback status
     */
    forceUpdate() {
        this._system.onStart();
        if (!this._context.attributes.autoplay) this.pause();
    }

    onResize(size: LiveSize) {
        this._system.updateSize(size);
    }

    onAttrUpdate(attr: LiveAttributes) {
        this._system.updateAttributes(attr);
    }

    protected onPause(): void {
        this._system.pause();
    }

    protected onPlay(): void {
        this._system.play();
    }

    protected onStart() {
        this._system.start();
        if (!this._context.attributes.autoplay) this.pause();

        AnimationController.registerSystem(this._system);
    }

    protected onStop() {
        this._system.stop();
        AnimationController.deregisterSystem(this._system);
    }
}
