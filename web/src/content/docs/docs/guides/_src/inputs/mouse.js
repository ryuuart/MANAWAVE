import { MW } from "manawave";

const mw = new MW("#manawave-marquee");

window.addEventListener("mousemove", (ev) => {
    let mouseAngle =
        -(Math.atan2(ev.y - innerHeight / 2, ev.x - innerWidth / 2) * 180) /
        Math.PI;

    mw.direction = mouseAngle;
});