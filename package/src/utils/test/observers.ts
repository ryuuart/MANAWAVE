import { SizeObserver } from "../observers";
import type { SizeListener } from "../observers";

async function waitUntilStyle(
    wdioEl: WebdriverIO.Element,
    property: string,
    value: string
) {
    let wdioCSSProperty = await (await wdioEl.getCSSProperty(property)).value;
    if (wdioCSSProperty === value) return true;
    return false;
}

describe("observers", () => {
    it("should observe 1 element border box size changes over time", async () => {
        const testCase = [
            { w: 500, h: 500 },
            { w: 250, h: 500 },
            { w: 250, h: 130 },
        ];
        const el = document.createElement("div");
        el.id = "test-element";
        el.style.width = "500px";
        el.style.height = "500px";
        document.body.append(el);
        const wdioEl = $(`#${el.id}`);
        await wdioEl.waitForExist();

        const sizeObserver = new SizeObserver(el);

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
        sizeObserver.connect(listener);

        const delay = 100;
        await browser.pause(delay);
        el.style.width = "250px";
        await waitUntilStyle(await wdioEl, "width", "250px");
        await browser.pause(delay);
        el.style.height = "130px";
        await waitUntilStyle(await wdioEl, "height", "130px");
        await browser.pause(delay);
        el.style.width = "-1px";
        await waitUntilStyle(await wdioEl, "width", "0px");

        for (let i = 0; i < testCase.length; i++) {
            expect(results[i]).toEqual(testCase[i]);
        }
    });
});
