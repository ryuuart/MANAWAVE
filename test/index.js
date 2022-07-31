import Billboard from "../dist/billboard.module";

const ticker = new Billboard()

document.getElementById("destroy").addEventListener("click", () => {
    ticker.destroy();
})

document.getElementById("setup").addEventListener("click", () => {
    ticker.init();
})