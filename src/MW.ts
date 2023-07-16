import PlaybackObject from "./anim/playbackObject";
import Controller from "./ticker/controller";
import Context from "./ticker/context";
import MWM from "./MWM";
import { PipelineHooksMap } from "./ticker/pipeline";

/**
 * Main manawave object used to control the behavior of the ticker
 */
export class MW extends PlaybackObject {
    private _controller: Controller;
    private _context: Context;

    constructor(
        selector: Parameters<Document["querySelector"]>[0] | HTMLElement,
        options?: Partial<manawave.Options>
    ) {
        super();

        // sets up, measure the DOM, and store results into global context
        this._context = Context.setup(selector, options);
        // associate the root element
        MWM.register(this._context.root, this);

        this._controller = new Controller(this._context);

        // start this individual animation
        this.start();
    }

    /**
     * View or operate all elements in the ticker that is currently on screen.
     * @param callback hook invoked on each observed element
     */
    eachElement(callback: PipelineHooksMap["eachElement"]) {
        this._controller.eachElement(callback);
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

    /**
     * Sets the hook to be invoked when an item is updated or drawn to the DOM
     */
    set onElementDraw(callback: PipelineHooksMap["elementDraw"]) {
        this._controller.setHook("elementDraw", callback);
    }

    /**
     * Sets the hook to be invoked when an item is removed from the DOM
     */
    set onElementDestroyed(callback: PipelineHooksMap["elementDestroyed"]) {
        this._controller.setHook("elementDestroyed", callback);
    }

    /**
     * Sets the hook to be invoked when an item is about to loop from one end to the other
     */
    set onLoop(callback: PipelineHooksMap["loop"]) {
        this._controller.setHook("loop", callback);
    }

    /**
     * Current speed of the ticker
     */
    get speed(): number {
        return this._context.attributes.speed;
    }

    /**
     * Current direction of the ticker
     */
    get direction(): number {
        return this._context.attributes.direction;
    }

    /**
     * Overrides the global speed of the ticker
     *
     * @remark the hooks will override this
     */
    set speed(n: number) {
        this._controller.updateAttribute({ speed: n });
    }

    /**
     * Overrides the global direction of the ticker
     *
     * @remark the hooks will override this
     */
    set direction(n: number) {
        this._controller.updateAttribute({ direction: n });
    }

    /**
     * Overrides the global autoplay setting of the ticker
     */
    set autoplay(state: boolean) {
        this._controller.updateAttribute({ autoplay: state });
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
