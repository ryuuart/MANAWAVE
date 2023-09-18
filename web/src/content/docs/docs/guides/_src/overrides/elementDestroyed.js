import { MW } from "manawave";

let currentText = "MANAWAVE";

const mw = new MW("#manawave-marquee", {
    onElementCreated: ({ element }) => {
        element.firstChild.innerHTML = currentText + "&nbsp;";
    },
    onElementDestroyed: ({ element }) => {
        currentText = "DESTROYED";
    }
})