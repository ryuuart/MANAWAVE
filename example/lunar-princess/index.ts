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
        duration: 10000 + Math.random() * 8000,
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
            left: limits.left - itemSize.width * 2,
            right: limits.right + itemSize.width * 2,
            top: limits.top - itemSize.height * 2,
            bottom: limits.bottom + itemSize.height * 2,
        },
    });

    mw.onElementCreated = ({ element }) => {
        for (const child of element.children[0].children) {
            const el = child as HTMLElement;
            el.style.transform = `scale(${
                0.75 + Math.random() * 1.5
            }) rotate3d(${Math.random()}, ${Math.random()}, ${Math.random()} , ${
                Math.random() * 90
            }deg)`;

            const rotationAnimations: Keyframe[] = [
                { transform: "rotate3d(0, 0, 0, 0)" },
                {
                    transform: `rotate3d(${
                        Math.random() * 0.2
                    }, ${Math.random()}, ${Math.random() * 0.2}, ${360}deg)`,
                },
            ];
            const translationAnimations: Keyframe[] = [
                {
                    transform: `translate3d(0, 0, 0)`,
                },
                {
                    transform: `translate3d(${Math.random() * 256}px, ${
                        Math.random() * 256
                    }px, ${Math.random() * 512}px)`,
                },
                {
                    transform: `translate3d(0, 0, 0)`,
                },
            ];

            el.animate(rotationAnimations, genAnimoptions());
            el.animate(translationAnimations, genAnimoptions());

            if (Math.random() * 10 < 4) el.style.visibility = "hidden";
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
