import { getMW } from "manawave";

window.addEventListener("load", () => {
    const themeBtnElement = document.getElementById("theme-btn")!;
    const petalFieldElement = document.getElementById("petal-field")!;

    const mw = getMW(petalFieldElement)!;

    themeBtnElement.addEventListener("click", () => {
        const prefersDarkScheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

        if (prefersDarkScheme.matches) {
            // ...then apply the .light-theme class to override those styles
            document.body.classList.toggle("light-theme");
            // Otherwise...
        } else {
            // ...apply the .dark-theme class to override the default light styles
            document.body.classList.toggle("dark-theme");
        }
    });
});
