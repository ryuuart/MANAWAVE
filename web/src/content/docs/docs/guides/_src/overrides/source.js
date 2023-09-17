import html from "./index.html?raw";
import layoutJS from "./layout.js?raw";
import moveJS from "./move.js?raw";
import loopJS from "./loop.js?raw";
import elementCreatedJS from "./elementCreated.js?raw";
import elementDrawnJS from "./elementDrawn.js?raw";
import elementDeletedJS from "./elementDeleted.js?raw";

export default {
    html,
    js: {
        layout: layoutJS,
        move: moveJS,
        loop: loopJS,
        elementCreated: elementCreatedJS,
        elementDrawn: elementDrawnJS,
        elementDeleted: elementDeletedJS
    }
}