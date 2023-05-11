import { System } from "@billboard/lib";
import AnimationPlayer from "./AnimationPlayer";

export default class AnimationController {
    private static _systems: Set<System> = new Set();

    private static _renderID: number | undefined;

    private static _currentTime: DOMHighResTimeStamp = window.performance.now();
    private static _totalTime: DOMHighResTimeStamp = 0;
    private static _targetDT: number = 1 / 60.0; // Target Delta Time

    private static _player: AnimationPlayer = new AnimationPlayer();

    static start() {
        AnimationController._player.start(() => {
            AnimationController._totalTime = 0;
            AnimationController._currentTime = window.performance.now();

            AnimationController._renderID = window.requestAnimationFrame(
                AnimationController.render.bind(AnimationController)
            );
        });
    }

    static stop() {
        AnimationController._player.stop(() => {
            if (AnimationController._renderID) {
                window.cancelAnimationFrame(AnimationController._renderID);
            }
        });
    }

    static play() {
        AnimationController._player.play();
    }

    static pause() {
        AnimationController._player.pause();
    }

    static registerSystem(system: System) {
        AnimationController._systems.add(system);
    }

    static deregisterSystem(system: System) {
        AnimationController._systems.delete(system);
    }

    static render(timestamp: DOMHighResTimeStamp) {
        let newTime = timestamp;
        let frameTime = newTime - AnimationController._currentTime;
        AnimationController._currentTime = newTime;

        // if time has progressed
        while (frameTime > 0.0) {
            // if you're lagging, use the frame time
            // if you're running super fast, sync to the fixed time
            let dt = Math.min(frameTime, AnimationController._targetDT);

            // Update the overall system
            for (const system of AnimationController._systems) {
                system.update(dt, AnimationController._totalTime);
            }

            // Render
            for (const system of AnimationController._systems) {
                system.draw();
            }

            // step once
            frameTime -= dt;

            this._totalTime += dt;
        }

        window.requestAnimationFrame(this.render.bind(this));
    }
}
