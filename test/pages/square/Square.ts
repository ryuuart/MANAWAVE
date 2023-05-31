import Base from "test/pages/base/Base";
import squareHTML from "./index.html?raw";

class Square extends Base {
    get square() {
        return this.testContent;
    }

    loadContent(): void {
        super.loadContent(squareHTML, "");
    }
}

export default new Square();
