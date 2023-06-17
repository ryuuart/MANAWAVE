import { Ouroboros } from "../../src";

const mousePos = {
    x: 0,
    y: 0,
};

window.addEventListener("mousemove", (ev) => {
    mousePos.x = ev.x;
    mousePos.y = ev.y;
});

const ob = new Ouroboros("#dom-base", {
    autoplay: true,
    direction: "345",
    speed: 2,
});
