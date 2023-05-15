import { System } from "@billboard/lib";
import PlaybackObject from "./PlaybackObject";

class AnimationController extends PlaybackObject {
    private _systems: Set<System> = new Set();

    private _renderID: number | undefined;

    private _currentTime: DOMHighResTimeStamp = window.performance.now();
    private _totalTime: DOMHighResTimeStamp = 0;
    private _targetDT: DOMHighResTimeStamp = 1000 / 60.0; // Target Delta Time

    onStart(): void {
        this._totalTime = 0;
        this._currentTime = window.performance.now();

        this._renderID = window.requestAnimationFrame(this.render.bind(this));
    }

    onStop() {
        if (this._renderID) {
            window.cancelAnimationFrame(this._renderID);
        }
    }

    registerSystem(system: System) {
        this._systems.add(system);
    }

    deregisterSystem(system: System) {
        this._systems.delete(system);
    }

    render(timestamp: DOMHighResTimeStamp) {
        let newTime = timestamp;
        let frameTime = newTime - this._currentTime;
        this._currentTime = newTime;

        if (this.status.started && !this.status.paused) {
            // if time has progressed
            while (frameTime > 0.0) {
                // if you're lagging, use the frame time
                // if you're running super fast, sync to the fixed time
                let dt = Math.min(frameTime, this._targetDT);

                // Update the overall system
                for (const system of this._systems) {
                    system.update(dt, this._totalTime);
                }

                // step once
                frameTime -= dt;

                this._totalTime += dt;
            }

            // Render
            for (const system of this._systems) {
                system.draw();
            }
        }

        window.requestAnimationFrame(this.render.bind(this));
    }
}

export default new AnimationController();
