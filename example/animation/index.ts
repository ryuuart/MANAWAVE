import AnimationController from "@billboard/anim/AnimationController";
import { setTranslate } from "@billboard/dom";

function lerp(v0: number, v1: number, t: number) {
    return v0 * (1 - t) + v1 * t;
}

let mousePos = {
    x: 0,
    y: 0,
};

window.addEventListener("mousemove", (ev: MouseEvent) => {
    mousePos.x = ev.x;
    mousePos.y = ev.y;
});

const animationController = new AnimationController();

const element = document.getElementById("square")!;
setTranslate(element, [0, 0]);

animationController.addAnimation({
    ref: element,
    position: [0, 0],
    update: function (dt) {
        this.position[0] = lerp(this.position[0], mousePos.x, dt * 0.01);
        this.position[1] = lerp(this.position[1], mousePos.y, dt * 0.01);
    },
    draw: function () {
        setTranslate(this.ref, this.position);
    },
});

animationController.start();
