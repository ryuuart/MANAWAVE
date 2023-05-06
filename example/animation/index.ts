import AnimationController from "@billboard/anim/AnimationController";
import DOMAnimationObject from "@billboard/anim/DOMAnimationObject";
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

const animationController = new AnimationController();

const element = document.getElementById("square")!;

const animationObject = new DOMAnimationObject(999, element);
animationObject.position = [0, 0];
animationObject.update = function (dt) {
    this.position[0] = lerp(this.position[0], mousePos.x, dt * 0.01);
    this.position[1] = lerp(this.position[1], mousePos.y, dt * 0.01);
};

animationController.addAnimation(animationObject);

animationController.start();
