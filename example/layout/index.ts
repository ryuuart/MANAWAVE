import { Billboard, getBillboard } from "../../src";

const mousePos = {
    x: 0,
    y: 0,
};

window.addEventListener("mousemove", (ev) => {
    mousePos.x = ev.x;
    mousePos.y = ev.y;
});

const regularTicker = document.getElementById("dom-base");

const billboard = new Billboard(regularTicker!, {
    autoplay: true,
    direction: "345",
    speed: 2,
});
billboard.onItemUpdated(({ t, position }) => {
    position[0] += Math.cos(t * 0.005 + 0) * 2;
    position[1] += Math.sin(t * 0.005 + 0) * 1;

    return { position };
});

const webcNormal = document.getElementById("webc-normal");
const webcNormalBB = getBillboard(webcNormal!)!;
webcNormalBB.onItemUpdated(({ direction }) => {
    direction = [
        mousePos.x - window.innerWidth / 2,
        mousePos.y - window.innerHeight / 2,
    ];

    return { direction };
});

// let paused = false;
// setInterval(() => {
//     if (!paused) {
//         paused = true;
//         webcNormalBB.pause();
//     } else {
//         paused = false;
//         webcNormalBB.play();
//     }
// }, 1000);
