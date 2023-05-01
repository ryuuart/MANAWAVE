import sharedCSS from "test/pages/shared/style.css?raw";

export default class Base {
    constructor() {}

    loadHTML(htmlText: string) {
        document.body.insertAdjacentHTML("beforeend", htmlText);
    }

    loadCSS(cssText: string) {
        const styleElem = document.createElement("style");
        styleElem.textContent = cssText;
        document.head.append(styleElem);
    }

    loadContent(htmlText: string, cssText: string) {
        this.loadHTML(htmlText);
        this.loadCSS(sharedCSS);
        this.loadCSS(cssText);
    }

    clearContent() {
        document.body.replaceChildren();

        const styleElements = document.getElementsByTagName("style");
        for (const element of styleElements) {
            element.remove();
        }
    }
}
