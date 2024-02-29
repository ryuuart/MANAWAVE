import { mappedMutationObserver, multiResizeObserver } from "../observers";
import type { DomNodeListener, SizeListener } from "../observers";

describe("observers", () => {
    // needs delay sandwiching each change
    // so observers have time to report
    const delay = 150;

    describe("resize observer", () => {
        it("should observe 2 element border box size changes over time", async () => {
            const testCase = [
                { w: 500, h: 500 },
                { w: 500, h: 500 },
                { w: 250, h: 500 },
                { w: 500, h: 130 },
                { w: 100, h: 300 },
                { w: 300, h: 200 },
            ];
            const elems = await Promise.all(
                createWdioElementList(500, 500, "red", 2)
            );
            const results: { w: number; h: number }[] = [];
            const listener: SizeListener = {
                onSizeUpdate: (entry) => {
                    const r = {
                        w: entry.borderBoxSize[0].inlineSize,
                        h: entry.borderBoxSize[0].blockSize,
                    };
                    results.push(r);
                },
            };
            multiResizeObserver.connect(elems[0].dom, listener);
            multiResizeObserver.connect(elems[1].dom, listener);

            // change 1st width
            await browser.pause(delay);
            elems[0].style.width = "250px";
            await waitUntilStyle(elems[0], "width", "250px");
            await browser.pause(delay);

            // change 2nd height
            await browser.pause(delay);
            elems[1].style.height = "130px";
            await waitUntilStyle(elems[1], "height", "130px");
            await browser.pause(delay);

            // change all at once
            await browser.pause(delay);
            elems[0].style.width = "100px";
            elems[1].style.width = "300px";
            elems[0].style.height = "300px";
            elems[1].style.height = "200px";
            await waitUntilStyle(elems[0], "width", "100px");
            await waitUntilStyle(elems[1], "width", "300px");
            await waitUntilStyle(elems[0], "height", "300px");
            await waitUntilStyle(elems[1], "height", "200px");
            await browser.pause(delay);

            multiResizeObserver.destroy();

            for (let i = 0; i < testCase.length; i++) {
                expect(results[i]).toEqual(testCase[i]);
            }
        });
        it("should observe element only when the element is connected", async () => {
            const testCase = [
                { w: 500, h: 500 },
                { w: 250, h: 500 },
                { w: 100, h: 500 },
                { w: 350, h: 500 },
            ];
            const el = await createWdioElement(500, 500, "red");
            const results: { w: number; h: number }[] = [];
            const listener: SizeListener = {
                onSizeUpdate: (entry) => {
                    const r = {
                        w: entry.borderBoxSize[0].inlineSize,
                        h: entry.borderBoxSize[0].blockSize,
                    };
                    results.push(r);
                },
            };
            multiResizeObserver.connect(el.dom, listener);

            await browser.pause(delay);
            el.style.width = "250px";
            await waitUntilStyle(el, "width", "250px");
            await browser.pause(delay);

            multiResizeObserver.disconnect(el.dom, listener);

            await browser.pause(delay);
            el.style.width = "999px";
            await waitUntilStyle(el, "width", "999px");
            await browser.pause(delay);

            await browser.pause(delay);
            el.style.width = "100px";
            await waitUntilStyle(el, "width", "100px");
            await browser.pause(delay);

            multiResizeObserver.connect(el.dom, listener);

            await browser.pause(delay);
            el.style.width = "350px";
            await waitUntilStyle(el, "width", "350px");
            await browser.pause(delay);

            multiResizeObserver.destroy();

            for (let i = 0; i < testCase.length; i++) {
                expect(results[i]).toEqual(testCase[i]);
            }
        });

        it("should not observe element when the observer is destroyed", async () => {
            const testCase = [
                { w: 500, h: 500 },
                { w: 250, h: 500 },
            ];
            const el = await createWdioElement(500, 500, "red");
            const results: { w: number; h: number }[] = [];
            const listener: SizeListener = {
                onSizeUpdate: (entry) => {
                    const r = {
                        w: entry.borderBoxSize[0].inlineSize,
                        h: entry.borderBoxSize[0].blockSize,
                    };
                    results.push(r);
                },
            };
            multiResizeObserver.connect(el.dom, listener);

            await browser.pause(delay);
            el.style.width = "250px";
            await waitUntilStyle(el, "width", "250px");
            await browser.pause(delay);

            multiResizeObserver.destroy();

            await browser.pause(delay);
            el.style.width = "100px";
            await waitUntilStyle(el, "width", "100px");
            await browser.pause(delay);

            multiResizeObserver.destroy();

            for (let i = 0; i < testCase.length; i++) {
                expect(results[i]).toEqual(testCase[i]);
            }
        });
    });

    describe("mutation observer", () => {
        type TestCase = {
            attr: string;
            value: string;
        };
        class TestMutationListener implements DomNodeListener {
            #results: TestCase[];
            constructor(results: TestCase[]) {
                this.#results = results;
            }
            onDomNodeUpdate(entry: MutationRecord) {
                if (entry.type === "attributes") {
                    const attr = entry.attributeName;
                    if (attr !== null) {
                        const value = (entry.target as Element).getAttribute(
                            attr
                        );
                        if (value !== null) {
                            this.#results.push({
                                attr,
                                value,
                            });
                        }
                    }
                }
            }
        }

        it("should report different node changes when 2 nodes change over time", async () => {
            const testCase = [
                { attr: "speed", value: "2" },
                { attr: "color", value: "blue" },
            ];
            const results: TestCase[] = [];
            const listener1 = new TestMutationListener(results);
            const listener2 = new TestMutationListener(results);
            const elems = await Promise.all(
                createWdioElementList(50, 50, "red", 2)
            );
            mappedMutationObserver.connect(elems[0].dom, listener1, {
                attributes: true,
            });
            mappedMutationObserver.connect(elems[1].dom, listener2, {
                attributes: true,
            });

            await browser.pause(delay);
            elems[0].dom.setAttribute("speed", "2");
            await browser.pause(delay);

            await browser.pause(delay);
            elems[1].dom.setAttribute("color", "blue");
            await browser.pause(delay);

            for (let i = 0; i < results.length; i++) {
                const r = results[i];
                const tc = testCase[i];

                expect(r).toEqual(tc);
            }
        });
    });
});

type TestElement = {
    dom: HTMLElement;
    style: CSSStyleDeclaration;
    wdio: Promise<WebdriverIO.Element>;
};

async function waitUntilStyle(
    tEl: TestElement,
    property: string,
    value: string
) {
    const wdioEl = await tEl.wdio;
    let wdioCSSProperty = (await wdioEl.getCSSProperty(property)).value;
    if (wdioCSSProperty === value) return true;
    return false;
}

async function createWdioElement(
    w: number,
    h: number,
    color: string
): Promise<TestElement> {
    const el = document.createElement("div");
    el.id = "test-element";
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.background = color;
    document.body.append(el);
    const wdioEl = $(`#${el.id}`);
    await wdioEl.waitForExist();

    return { dom: el, wdio: wdioEl, style: el.style };
}

function createWdioElementList(
    w: ((n: number) => number) | number,
    h: ((n: number) => number) | number,
    color: ((n: number) => string) | string,
    n: number
): Promise<TestElement>[] {
    const result: Promise<TestElement>[] = [];

    for (let i = 0; i < n; i++) {
        let pw = 0;
        let ph = 0;
        let pcolor = "none";

        switch (typeof w) {
            case "function":
                pw = w(n);
                break;
            case "number":
                pw = w;
                break;
        }
        switch (typeof h) {
            case "function":
                ph = h(n);
                break;
            case "number":
                ph = h;
                break;
        }
        switch (typeof color) {
            case "function":
                pcolor = color(n);
                break;
            case "number":
                pcolor = color;
                break;
        }

        result.push(createWdioElement(pw, ph, pcolor));
    }

    return result;
}
