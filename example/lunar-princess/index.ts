import { toRadians } from "@manawave/ticker/math";
import { MW, getMW } from "manawave";

let mouseAngle = 0;
window.addEventListener("mousemove", (ev) => {
    mouseAngle =
        -(Math.atan2(ev.y - innerHeight / 2, ev.x - innerWidth / 2) * 180) /
        Math.PI;
});

function genAnimoptions(): KeyframeAnimationOptions {
    const animOptions: KeyframeAnimationOptions = {
        duration: 8000 + Math.random() * 8000,
        iterations: Infinity,
        delay: Math.random() * 3000,
        easing: "cubic-bezier(0.42, 0, 0.58, 1)",
        composite: "add",
    };
    return animOptions;
}

window.addEventListener("load", () => {
    const themeBtnElement = document.getElementById("theme-btn")!;
    const petalFieldElement = document.getElementById("petal-field")!;

    const mw = getMW(petalFieldElement)!;

    let circlePos = -10;
    mw.onLayout = ({ position, limits }) => {
        circlePos += 20;
        return {
            position: {
                x:
                    position.x +
                    Math.cos(toRadians(circlePos)) * limits.width * 0.04,
                y:
                    limits.height +
                    position.y +
                    Math.sin(toRadians(circlePos)) * limits.height * 0.08,
            },
        };
    };
    mw.onMove = () => {
        return { direction: mouseAngle };
    };
    mw.onLoop = ({ limits, itemSize }) => ({
        limits: {
            left: limits.left - itemSize.width * 0.5,
            right: limits.right + itemSize.width * 0.5,
            top: limits.top - itemSize.height * 0.5,
            bottom: limits.bottom + itemSize.height * 0.5,
        },
    });

    mw.onElementCreated = ({ element }) => {
        for (const child of element.children[0].children) {
            element.style.transform = `scale(${
                0.5 + (Math.random() - 0.5) * 2
            })`;
            const rotationAnimations: Keyframe[] = [
                { transform: "rotate3d(0)" },
                {
                    transform: `rotate3d(${
                        Math.random() * 0.2
                    }, ${Math.random()}, ${
                        Math.random() * 0.2
                    }, ${360}deg) translate(0)`,
                },
            ];
            const translationAnimations: Keyframe[] = [
                {
                    transform: `translate(0)`,
                },
                {
                    transform: `translate(${Math.random() * 256}px, ${
                        Math.random() * 256
                    }px)`,
                },
                {
                    transform: `translate(0)`,
                },
            ];

            child.animate(rotationAnimations, genAnimoptions());
            child.animate(translationAnimations, genAnimoptions());
        }
        return { element };
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
