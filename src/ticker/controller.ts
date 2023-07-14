import { AnimationController } from "@manawave/anim";
import Context, { LiveAttributes, LiveSize } from "./context";
import System from "./system";
import PlaybackObject from "@manawave/anim/PlaybackObject";
import { PipelineHooksMap } from "./pipeline";

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
     * Peeks or views each element in the ticker for operation or observation.
     *
     * @param callback hook that operates on each observed elements
     */
    eachElement(callback: PipelineHooksMap["eachElement"]) {
        this._system.viewItems((item) => {
            callback({ element: item.element, id: item.id });
        });
    }

    /**
     * Sets a given callback into the {@link Pipeline}
     * @param type type of hook
     * @param callback hook that should be invoked depending on type
     */
    setHook<K extends keyof PipelineHooksMap>(
        type: K,
        callback: PipelineHooksMap[K]
    ) {
        switch (type) {
            case "layout":
                this._context.pipeline.onLayout =
                    callback as PipelineHooksMap["layout"];
                this.forceUpdate();
                break;
            case "move":
                this._context.pipeline.onMove =
                    callback as PipelineHooksMap["move"];
                break;
            case "loop":
                this._context.pipeline.onLoop =
                    callback as PipelineHooksMap["loop"];
                break;
            case "elementCreated":
                this._context.pipeline.onElementCreated =
                    callback as PipelineHooksMap["elementCreated"];
                this.forceUpdate();
                break;
            case "elementDraw":
                this._context.pipeline.onElementDraw =
                    callback as PipelineHooksMap["elementDraw"];
                this.forceUpdate();
                break;
            case "elementDestroyed":
                this._context.pipeline.onElementDestroyed =
                    callback as PipelineHooksMap["elementDestroyed"];
        }
    }

    /**
     * Forcibly re-fill / re-layout the system regardless of playback status
     */
    forceUpdate() {
        this._system.onStart();
        if (!this._context.attributes.autoplay) this.pause();
    }

    updateAttribute(
        attr: Partial<{ speed: number; direction: number; autoplay: boolean }>
    ) {
        this._context.attributes = attr;
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
