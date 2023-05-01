import Base from "test/pages/base/Base";
import squareHTML from "./index.html?raw";

class Square extends Base {
    get square() {
        return document.getElementById("square")!;
    }

    loadContent(): void {
        super.loadContent(squareHTML, "");
    }
}

export default new Square();
