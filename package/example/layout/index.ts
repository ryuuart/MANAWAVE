import { MW } from "manawave";

new MW("#dom-base", {
    autoplay: true,
    direction: "345",
    speed: 2,
});

new MW("#dom-no-attr");

const overrideAutoplay = new MW("#dom-override-autoplay");
overrideAutoplay.play();
