import sharedCSS from "test/pages/shared/style.css?raw";

export default class Base {
    protected htmlRoot: HTMLElement;
    protected testContent: HTMLElement | undefined | null;

    constructor() {
        const currentRoot = document.getElementById("test-root");
        if (currentRoot) this.htmlRoot = currentRoot;
        else {
            this.htmlRoot = document.createElement("div");
            this.htmlRoot.id = "test-root";
            this.htmlRoot.style.position = "relative";
            this.htmlRoot.style.zIndex = "-1";

            document.body.append(this.htmlRoot);
        }
    }

    loadHTML(htmlText: string) {
        const element = document.createElement("template");
        element.innerHTML = htmlText;
        this.testContent = element.content.firstElementChild as HTMLElement;

        this.htmlRoot.insertAdjacentElement("beforeend", this.testContent);
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
        this.testContent?.remove();

        const styleElements = document.getElementsByTagName("style");
        for (const element of styleElements) {
            element.remove();
        }
    }
}
