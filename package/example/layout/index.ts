import { MW } from "manawave";

const ob = new MW("#dom-base", {
    autoplay: true,
    direction: "345",
    speed: 2,
});

const noAttr = new MW("#dom-no-attr");

const mousePos = {
    x: 0,
    y: 0,
};

window.addEventListener("mousemove", (ev) => {
    mousePos.x = ev.x;
    mousePos.y = ev.y;
});
