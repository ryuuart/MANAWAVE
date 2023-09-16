import { MW } from "manawave";

const mw = new MW("#manawave-marquee");

document.addEventListener("keydown", (ev) => {
    ev.preventDefault();

    switch (ev.key) {
        case "ArrowUp":
            mw.direction = 90;
            break;
        case "ArrowRight":
            mw.direction = 0;
            break;
        case "ArrowDown":
            mw.direction = 270;
            break;
        case "ArrowLeft":
            mw.direction = 180;
            break;
    }
});