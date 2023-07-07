import PlaybackObject from "./anim/PlaybackObject";
import Controller from "./ticker/controller";
import Context from "./ticker/context";
import MWM from "./MWM";

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

    beforeElementAdd(callback: (element: HTMLElement) => void) {}

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
