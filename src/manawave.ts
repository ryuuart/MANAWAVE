import PlaybackObject from "./anim/PlaybackObject";
import Controller from "./ticker/controller";
import Context from "./ticker/context";
import MWM from "./MWM";
import Pipeline from "./ticker/pipeline";

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
    set onLayout(callback: Pipeline["_onLayout"]) {
        this._controller.setOnLayout(callback);
    }

    /**
     * Sets the hook to be invoked when an item is about to be moved
     */
    set onMove(callback: Pipeline["_onMove"]) {
        this._controller.setOnMove(callback);
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
