import { multiResizeObserver } from "../observers";
import type { SizeListener } from "../observers";

describe("observers", () => {
    describe("resize observer", () => {
        // needs delay sandwiching each change
        // so observer has time to report
        const delay = 25;
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
            await browser.pause(delay);

            await waitUntilStyle(elems[1], "height", "130px");
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

            for (let i = 0; i < testCase.length; i++) {
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
