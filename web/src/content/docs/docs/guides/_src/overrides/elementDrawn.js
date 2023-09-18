import { MW } from "manawave";

const mw = new MW("#manawave-marquee", {
    onElementDraw: ({ element, t }) => {
        element.style.background = `rgb(185, ${Math.abs(Math.cos(0.001 * t) * 200)}, 125)`;
    }
})