import { getMW } from "manawave";

const marqueeElement = document.getElementById("manawave-marquee");
const mw = getMW(marqueeElement);

mw.direction = 200;
mw.play();