import { MW } from "manawave";

let currentText = "MANAWAVE";

const mw = new MW("#manawave-marquee", {
    onElementCreated: ({ element }) => {
        element.textContent = currentText;
    },
    onElementDestroyed: ({ element }) => {
        currentText = "DESTROYED"
    }
})