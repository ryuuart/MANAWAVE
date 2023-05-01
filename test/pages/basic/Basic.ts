import Base from "test/pages/base/Base";
import basicHTML from "./index.html?raw";
import basicCSS from "./style.css?raw";

class Basic extends Base {
    get ticker() {
        return document.getElementById("ticker")!;
    }

    loadContent(): void {
        super.loadContent(basicHTML, basicCSS);
    }
}

export default new Basic();
