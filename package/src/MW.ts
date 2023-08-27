import PlaybackObject from "./anim/playbackObject";
import Controller from "./marquee/controller";
import Context from "./marquee/context";
import MWM from "./MWM";

/**
 * Main manawave object used to control the behavior of the marquee
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
     * View or operate all elements in the marquee that is currently on screen.
     * @param callback hook invoked on each observed element
     */
    eachElement(callback: PipelineHooksMap["eachElement"]) {
        this._controller.eachElement(callback);
    }

    /**
     * Sets the hook to be invoked when layout occurs
     */
    set onLayout(callback: PipelineHooksMap["onLayout"]) {
        this._controller.setHook("onLayout", callback);
    }

    /**
     * Sets the hook to be invoked when an item is about to be moved
     */
    set onMove(callback: PipelineHooksMap["onMove"]) {
        this._controller.setHook("onMove", callback);
    }

    /**
     * Sets the hook to be invoked when an item is about to be rendered to the DOM
     */
    set onElementCreated(callback: PipelineHooksMap["onElementCreated"]) {
        this._controller.setHook("onElementCreated", callback);
    }

    /**
     * Sets the hook to be invoked when an item is updated or drawn to the DOM
     */
    set onElementDraw(callback: PipelineHooksMap["onElementDraw"]) {
        this._controller.setHook("onElementDraw", callback);
    }

    /**
     * Sets the hook to be invoked when an item is removed from the DOM
     */
    set onElementDestroyed(callback: PipelineHooksMap["onElementDestroyed"]) {
        this._controller.setHook("onElementDestroyed", callback);
    }

    /**
     * Sets the hook to be invoked when an item is about to loop from one end to the other
     */
    set onLoop(callback: PipelineHooksMap["onLoop"]) {
        this._controller.setHook("onLoop", callback);
    }

    /**
     * Current speed of the marquee
     */
    get speed(): number {
        return this._context.attributes.speed;
    }

    /**
     * Current direction of the marquee
     */
    get direction(): number {
        return this._context.attributes.direction;
    }

    /**
     * Overrides the global speed of the marquee
     *
     * @remark the hooks will override this
     */
    set speed(n: number) {
        this._controller.updateAttribute({ speed: n });
    }

    /**
     * Overrides the global direction of the marquee
     *
     * @remark the hooks will override this
     */
    set direction(n: number) {
        this._controller.updateAttribute({ direction: n });
    }

    /**
     * Overrides the global autoplay setting of the marquee
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
