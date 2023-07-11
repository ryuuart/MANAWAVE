import { toRadians } from "@manawave/ticker/math";
import { MW, getMW } from "manawave";

let mouseAngle = 0;
window.addEventListener("mouseover", (ev) => {
    mouseAngle =
        -(Math.atan2(ev.y - innerHeight / 2, ev.x - innerWidth / 2) * 180) /
        Math.PI;
});

window.addEventListener("load", () => {
    const themeBtnElement = document.getElementById("theme-btn")!;
    const petalFieldElement = document.getElementById("petal-field")!;

    const mw = getMW(petalFieldElement)!;

    let circlePos = -10;
    mw.onLayout = ({ position, limits }) => {
        circlePos += 40;
        return {
            position: {
                x:
                    position.x +
                    Math.cos(toRadians(circlePos)) * limits.width * 0.04,
                y:
                    position.y +
                    Math.sin(toRadians(circlePos)) * limits.height * 0.08,
            },
        };
    };
    mw.onMove = ({ direction, dt, t }) => {
        return { direction: Math.cos(t * 0.005) * 45 };
    };

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
