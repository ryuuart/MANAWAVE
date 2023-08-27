/**
 * Represents the series of hooks and user-provided transformations
 * on the default data / configuration of the Marquee
 */
export class Pipeline {
    onLayout: PipelineHooksMap["onLayout"];
    onMove: PipelineHooksMap["onMove"];
    onLoop: PipelineHooksMap["onLoop"];
    onElementCreated: PipelineHooksMap["onElementCreated"];
    onElementDraw: PipelineHooksMap["onElementDraw"];
    onElementDestroyed: PipelineHooksMap["onElementDestroyed"];

    constructor() {
        this.onLayout = () => {};
        this.onMove = () => {};
        this.onLoop = () => {};
        this.onElementCreated = () => {};
        this.onElementDraw = () => {};
        this.onElementDestroyed = () => {};
    }
}
