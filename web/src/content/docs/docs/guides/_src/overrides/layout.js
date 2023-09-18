import { MW } from "manawave";

let circlePos = -10;

function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

const mw = new MW("#manawave-marquee", {
    onLayout: ({ limits }) => {
        circlePos += 10;
        return {
            position: {
                x: limits.width * Math.cos(toRadians(circlePos)),
                y: limits.height * Math.sin(toRadians(circlePos))
            }
        }
    }
});