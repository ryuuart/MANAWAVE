import { mappedMutationObserver, multiResizeObserver } from "../observers";
import type { DomNodeListener, SizeListener } from "../observers";
import { uid } from "../uid";

describe("observers", () => {
    // needs delay sandwiching each change
    // so observers have time to report
    const delay = 150;

    // afterEach(() => {
    //     document.body.replaceChildren();
    // });

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
            const elems = await createTestElementList(2, () => ({
                styles: {
                    width: "500px",
                    height: "500px",
                    background: "red",
                },
            }));
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
        it("should observe element only when the observer is connected", async () => {
            const testCase = [
                { w: 500, h: 500 },
                { w: 250, h: 500 },
                { w: 100, h: 500 },
                { w: 350, h: 500 },
            ];
            const el = await createTestElement({
                styles: { width: "500px", height: "500px", color: "red" },
            });
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
            const el = await createTestElement({
                styles: { width: "500px", height: "500px", color: "red" },
            });
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
                { attr: "speed", value: "2" },
                { attr: "color", value: "blue" },
                { attr: "speed", value: "3" },
                { attr: "color", value: "pink" },
                { attr: "color", value: "orange" },
                { attr: "speed", value: "3" },
                { attr: "direction", value: "20.272" },
            ];
            const results: TestCase[] = [];
            const listener1 = new TestMutationListener(results);
            const listener2 = new TestMutationListener(results);
            const elems = await createTestElementList(2, () => ({
                attributes: [
                    { name: "speed", value: "1" },
                    { name: "color", value: "red" },
                    { name: "direction", value: "0" },
                ],
            }));
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

            await browser.pause(delay);
            elems[0].dom.setAttribute("speed", "2");
            elems[1].dom.setAttribute("color", "blue");
            await browser.pause(delay);

            await browser.pause(delay);
            elems[0].dom.setAttribute("speed", "3");
            elems[0].dom.setAttribute("color", "pink");
            elems[1].dom.setAttribute("color", "orange");
            elems[1].dom.setAttribute("speed", "3");
            elems[1].dom.setAttribute("direction", "20.272");
            await browser.pause(delay + 100);

            for (let i = 0; i < results.length; i++) {
                expect(results[i]).toEqual(testCase[i]);
            }
        });

        it("should report different node changes only when the observer is connected", async () => {
            const testCase = [
                { attr: "speed", value: "2" },
                { attr: "color", value: "blue" },
            ];
            const results: TestCase[] = [];
            const listener = new TestMutationListener(results);
            const el = await createTestElement({
                attributes: [
                    { name: "speed", value: "1" },
                    { name: "color", value: "red" },
                    { name: "direction", value: "0" },
                ],
            });
            mappedMutationObserver.connect(el.dom, listener, {
                attributes: true,
            });

            await browser.pause(delay);
            el.dom.setAttribute("speed", "2");
            await browser.pause(delay);

            mappedMutationObserver.disconnect(el.dom, listener);

            await browser.pause(delay);
            el.dom.setAttribute("direction", "222.23");
            await browser.pause(delay);

            mappedMutationObserver.connect(el.dom, listener, {
                attributes: true,
            });

            await browser.pause(delay);
            el.dom.setAttribute("color", "blue");
            await browser.pause(delay);

            for (let i = 0; i < results.length; i++) {
                expect(results[i]).toEqual(testCase[i]);
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

interface TestElementOptions {
    styles: Partial<CSSStyleDeclaration>;
    attributes: { name: string; value: string }[];
    id: string;
}

async function createTestElement(
    options?: Partial<TestElementOptions>
): Promise<TestElement> {
    const el = document.createElement("div");

    // set default styles
    el.style.width = `${50}px`;
    el.style.height = `${50}px`;
    el.id = `test-element-${uid()}`;

    if (options !== undefined) {
        // set styles
        if (options.styles !== undefined) {
            for (const style in options.styles) {
                const newStyle = options.styles[style];
                if (newStyle !== undefined) {
                    el.style[style] = newStyle;
                }
            }
        }

        // set attributes
        if (options.attributes !== undefined) {
            for (const attr of options.attributes) {
                el.setAttribute(attr.name, attr.value);
            }
        }

        // set id
        if (options.id !== undefined) {
            el.id = options.id;
        }
    }

    document.body.append(el);
    const wdioEl = $(`#${el.id}`);
    await wdioEl.waitForExist();

    return { dom: el, wdio: wdioEl, style: el.style };
}

async function createTestElementList(
    n: number,
    callback?: (index: number) => Partial<TestElementOptions>
): Promise<TestElement[]> {
    const result: Promise<TestElement>[] = [];

    for (let i = 0; i < n; i++) {
        if (callback !== undefined) {
            result.push(createTestElement(callback(i)));
        } else {
            result.push(createTestElement());
        }
    }

    return await Promise.all(result);
}
