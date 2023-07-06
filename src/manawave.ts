import PlaybackObject from "./anim/PlaybackObject";
import Controller from "./ticker/controller";
import Context from "./ticker/context";

export class MW extends PlaybackObject {
    private _controller: Controller;

    constructor(
        selector: Parameters<Document["querySelector"]>[0] | HTMLElement,
        options?: Partial<manawave.Options>
    ) {
        super();

        const context = Context.setup(selector, options);
        this._controller = new Controller(context);
    }

    onStart() {
        this._controller.init();
    }

    onStop() {
        this._controller.deinit();
    }
}
