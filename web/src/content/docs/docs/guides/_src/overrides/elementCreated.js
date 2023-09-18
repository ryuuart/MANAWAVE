import { MW } from "manawave";

const mw = new MW("#manawave-marquee", {
    onElementCreated: ({ element }) => {
        element.style.background = "pink";
        element.style.padding = "1rem";
    }
})