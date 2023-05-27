import { Billboard } from "../../src";

const regularTicker = document.getElementById("dom-base");

const billboard = new Billboard(regularTicker!, {
    autoplay: true,
    direction: "345",
    speed: 2,
});
