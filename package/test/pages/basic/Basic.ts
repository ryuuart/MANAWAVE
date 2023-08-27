import Base from "test/pages/base/Base";
import basicHTML from "./index.html?raw";
import basicCSS from "./style.css?raw";

class Basic extends Base {
    get marquee() {
        return this.testContent;
    }

    loadContent() {
        super.loadContent(basicHTML, basicCSS);
    }
}

export default new Basic();
