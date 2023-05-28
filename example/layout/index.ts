import { Billboard, getBillboard } from "../../src";

const regularTicker = document.getElementById("dom-base");

const billboard = new Billboard(regularTicker!, {
    autoplay: true,
    direction: "345",
    speed: 2,
});

const webcNormal = document.getElementById("webc-normal");
const webcNormalBB = getBillboard(webcNormal!)!;

let paused = false;
setInterval(() => {
    if (!paused) {
        paused = true;
        webcNormalBB.pause();
    } else {
        paused = false;
        webcNormalBB.play();
    }
}, 1000);
