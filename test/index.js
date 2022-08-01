import Billboard from "../dist/billboard.module";

const ticker = new Billboard("billboard", {
    autoplay: true,
})

const ticker2 = new Billboard("billboard-2", {
    autoplay: true,
    speed: 2,
    direction: "up"
})

const ticker3 = new Billboard("billboard-3", {
    autoplay: true,
    speed: 2,
    direction: "up"
})

document.getElementById("destroy").addEventListener("click", () => {
    ticker3.destroy();
})

document.getElementById("setup").addEventListener("click", () => {
    ticker3.init();
})

document.getElementById("play").addEventListener("click", () => {
    ticker.play();
})

document.getElementById("pause").addEventListener("click", () => {
    ticker.pause();
})