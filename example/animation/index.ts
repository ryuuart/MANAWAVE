import { AnimationController, System } from "@billboard/anim";
import { lerp } from "@billboard/anim/Util";
import { setTranslate } from "@billboard/dom";

let mousePos = {
    x: 0,
    y: 0,
};

window.addEventListener("mousemove", (ev: MouseEvent) => {
    mousePos.x = ev.x;
    mousePos.y = ev.y;
});

const element = document.getElementById("square")!;

class ExampleSystem extends System {
    offset: Position;
    position: Position;
    element: HTMLElement;

    constructor(element: HTMLElement) {
        super();

        this.position = [0, 0];
        this.element = element;

        const rect = this.element.getBoundingClientRect();
        this.offset = [
            rect.left + this.element.offsetWidth / 2,
            rect.top + this.element.offsetHeight / 2,
        ];
    }

    onUpdate(dt: number, t: number): void {
        this.position[0] = lerp(
            this.position[0],
            mousePos.x - this.offset[0],
            dt * 0.01
        );
        this.position[1] = lerp(
            this.position[1],
            mousePos.y - this.offset[1],
            dt * 0.01
        );
    }
    onDraw(): void {
        setTranslate(this.element, this.position);
    }
}

const exampleSystem = new ExampleSystem(element);
exampleSystem.start();

AnimationController.registerSystem(exampleSystem);
AnimationController.start();
