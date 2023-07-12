import PlaybackObject from "./anim/PlaybackObject";
import Controller from "./ticker/controller";
import Context from "./ticker/context";
import MWM from "./MWM";
import { PipelineHooksMap } from "./ticker/pipeline";

export class MW extends PlaybackObject {
    private _controller: Controller;
    private _context: Context;

    constructor(
        selector: Parameters<Document["querySelector"]>[0] | HTMLElement,
        options?: Partial<manawave.Options>
    ) {
        super();

        this._context = Context.setup(selector, options);
        MWM.register(this._context.root, this);

        this._controller = new Controller(this._context);

        this.start();
    }

    /**
     * Sets the hook to be invoked when layout occurs
     */
    set onLayout(callback: PipelineHooksMap["layout"]) {
        this._controller.setHook("layout", callback);
    }

    /**
     * Sets the hook to be invoked when an item is about to be moved
     */
    set onMove(callback: PipelineHooksMap["move"]) {
        this._controller.setHook("move", callback);
    }

    /**
     * Sets the hook to be invoked when an item is about to be rendered to the DOM
     */
    set onElementCreated(callback: PipelineHooksMap["elementCreated"]) {
        this._controller.setHook("elementCreated", callback);
    }

    set onElementDraw(callback: PipelineHooksMap["elementDraw"]) {
        this._controller.setHook("elementDraw", callback);
    }

    /**
     * Sets the hook to be invoked when an item is about to loop from one end to the other
     */
    set onLoop(callback: PipelineHooksMap["loop"]) {
        this._controller.setHook("loop", callback);
    }

    protected onPause(): void {
        this._controller.pause();
    }

    protected onPlay(): void {
        this._controller.play();
    }

    protected onStart() {
        this._controller.start();
    }

    protected onStop() {
        this._controller.stop();
    }
}
