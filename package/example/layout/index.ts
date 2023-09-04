import { MW } from "manawave";

const ob = new MW("#dom-base", {
    autoplay: true,
    direction: "345",
    speed: 2,
});

const noAttr = new MW("#dom-no-attr");

const overrideAutoplay = new MW("#dom-override-autoplay");
overrideAutoplay.play();
