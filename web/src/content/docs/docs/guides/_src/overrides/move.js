import { MW } from "manawave";

const mw = new MW("#manawave-marquee", {
    onMove: ({ t }) => {
        return { direction: Math.cos(0.01 * t) * 30 }
    }
});