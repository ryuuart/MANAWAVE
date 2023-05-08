import sharedCSS from "test/pages/shared/style.css?raw";

export default class Base {
    protected htmlRoot: HTMLElement;

    constructor() {
        const currentRoot = document.getElementById("test-root");
        if (currentRoot) this.htmlRoot = currentRoot;
        else {
            this.htmlRoot = document.createElement("div");
            this.htmlRoot.id = "test-root";
            this.htmlRoot.style.overflow = "scroll";

            document.body.append(this.htmlRoot);
        }
    }

    loadHTML(htmlText: string) {
        this.htmlRoot.insertAdjacentHTML("beforeend", htmlText);
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
        this.htmlRoot.replaceChildren();

        const styleElements = document.getElementsByTagName("style");
        for (const element of styleElements) {
            element.remove();
        }
    }
}
