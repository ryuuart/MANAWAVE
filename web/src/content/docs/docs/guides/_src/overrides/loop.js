import { MW } from "manawave";

const mw = new MW("#manawave-marquee", {
    onLoop: ({ limits }) => {
        return {
            limits: {
                top: limits.top - 64,
                right: limits.right - 64,
                bottom: limits.bottom + 64,
                left: limits.left + 64,
            }
        };
    }
})