import { afterEach, describe, expect, it, vi } from "vitest";
import { settle, testRoot, unmountAll } from "test/fixtures";
import {
    mappedMutationObserver,
    mappedResizeObserver,
    type DomNodeListener,
    type SizeListener,
} from "../observers";

type Size = { w: number; h: number };
type AttributeChange = { attr: string; value: string };

function createElement(styles: Partial<CSSStyleDeclaration> = {}): HTMLElement {
    const element = document.createElement("div");
    element.style.width = "50px";
    element.style.height = "50px";
    Object.assign(element.style, styles);

    testRoot().append(element);

    return element;
}

/** A {@link SizeListener} that keeps every border box size it is handed. */
function sizeRecorder(): SizeListener & { results: Size[] } {
    const results: Size[] = [];

    return {
        results,
        onSizeUpdate(entry) {
            results.push({
                w: entry.borderBoxSize[0].inlineSize,
                h: entry.borderBoxSize[0].blockSize,
            });
        },
    };
}

/** A {@link DomNodeListener} that appends every attribute change it is handed. */
function attributeRecorder(results: AttributeChange[]): DomNodeListener {
    return {
        onDomNodeUpdate(entry) {
            if (entry.type !== "attributes" || entry.attributeName === null) {
                return;
            }

            const value = (entry.target as Element).getAttribute(
                entry.attributeName
            );
            if (value !== null) {
                results.push({ attr: entry.attributeName, value });
            }
        },
    };
}

/** Waits for an observer to have delivered exactly `count` records. */
function delivered(records: unknown[], count: number) {
    return vi.waitFor(() => expect(records).toHaveLength(count));
}

describe("observers", () => {
    afterEach(() => {
        mappedResizeObserver.destroy();
        mappedMutationObserver.destroy();
        unmountAll();
    });

    describe("resize observer", () => {
        it("should report border box changes for every connected element", async () => {
            const recorder = sizeRecorder();
            const first = createElement({ width: "500px", height: "500px" });
            const second = createElement({ width: "500px", height: "500px" });

            mappedResizeObserver.connect(first, recorder);
            mappedResizeObserver.connect(second, recorder);

            // observing an element reports its size straight away
            await delivered(recorder.results, 2);

            first.style.width = "250px";
            await delivered(recorder.results, 3);

            second.style.height = "130px";
            await delivered(recorder.results, 4);

            // changes spanning both elements arrive together, in observation order
            first.style.width = "100px";
            first.style.height = "300px";
            second.style.width = "300px";
            second.style.height = "200px";
            await delivered(recorder.results, 6);

            expect(recorder.results).toEqual([
                { w: 500, h: 500 },
                { w: 500, h: 500 },
                { w: 250, h: 500 },
                { w: 500, h: 130 },
                { w: 100, h: 300 },
                { w: 300, h: 200 },
            ]);
        });

        it("should report sizes only while a listener is connected", async () => {
            const recorder = sizeRecorder();
            const element = createElement({ width: "500px", height: "500px" });

            mappedResizeObserver.connect(element, recorder);
            await delivered(recorder.results, 1);

            element.style.width = "250px";
            await delivered(recorder.results, 2);

            mappedResizeObserver.disconnect(element, recorder);

            // neither of these may reach the recorder
            element.style.width = "999px";
            await settle();
            element.style.width = "100px";
            await settle();

            // reconnecting reports the size the element drifted to while away
            mappedResizeObserver.connect(element, recorder);
            await delivered(recorder.results, 3);

            element.style.width = "350px";
            await delivered(recorder.results, 4);

            expect(recorder.results).toEqual([
                { w: 500, h: 500 },
                { w: 250, h: 500 },
                { w: 100, h: 500 },
                { w: 350, h: 500 },
            ]);
        });

        it("should report nothing once the observer is destroyed", async () => {
            const recorder = sizeRecorder();
            const element = createElement({ width: "500px", height: "500px" });

            mappedResizeObserver.connect(element, recorder);
            await delivered(recorder.results, 1);

            element.style.width = "250px";
            await delivered(recorder.results, 2);

            mappedResizeObserver.destroy();

            element.style.width = "100px";
            await settle();

            expect(recorder.results).toEqual([
                { w: 500, h: 500 },
                { w: 250, h: 500 },
            ]);
        });
    });

    describe("mutation observer", () => {
        function createMarqueeish(): HTMLElement {
            const element = createElement();
            element.setAttribute("speed", "1");
            element.setAttribute("color", "red");
            element.setAttribute("direction", "0");

            return element;
        }

        it("should route node changes to the listener of their own element", async () => {
            const results: AttributeChange[] = [];
            const first = createMarqueeish();
            const second = createMarqueeish();

            mappedMutationObserver.connect(first, attributeRecorder(results), {
                attributes: true,
            });
            mappedMutationObserver.connect(second, attributeRecorder(results), {
                attributes: true,
            });

            first.setAttribute("speed", "2");
            await delivered(results, 1);

            second.setAttribute("color", "blue");
            await delivered(results, 2);

            // re-setting an attribute to the value it already holds still mutates it
            first.setAttribute("speed", "2");
            second.setAttribute("color", "blue");
            await delivered(results, 4);

            first.setAttribute("speed", "3");
            first.setAttribute("color", "pink");
            second.setAttribute("color", "orange");
            second.setAttribute("speed", "3");
            second.setAttribute("direction", "20.272");
            await delivered(results, 9);

            expect(results).toEqual([
                { attr: "speed", value: "2" },
                { attr: "color", value: "blue" },
                { attr: "speed", value: "2" },
                { attr: "color", value: "blue" },
                { attr: "speed", value: "3" },
                { attr: "color", value: "pink" },
                { attr: "color", value: "orange" },
                { attr: "speed", value: "3" },
                { attr: "direction", value: "20.272" },
            ]);
        });

        it("should report node changes only while a listener is connected", async () => {
            const results: AttributeChange[] = [];
            const recorder = attributeRecorder(results);
            const first = createMarqueeish();
            const second = createMarqueeish();

            mappedMutationObserver.connect(first, recorder, {
                attributes: true,
            });
            mappedMutationObserver.connect(second, recorder, {
                attributes: true,
            });

            first.setAttribute("speed", "2");
            await delivered(results, 1);

            mappedMutationObserver.disconnect(first, recorder);

            // the still-connected element keeps reporting
            second.setAttribute("color", "green");
            await delivered(results, 2);

            // the disconnected one does not
            first.setAttribute("direction", "222.23");
            await settle();

            mappedMutationObserver.connect(first, recorder, {
                attributes: true,
            });

            first.setAttribute("color", "blue");
            await delivered(results, 3);

            expect(results).toEqual([
                { attr: "speed", value: "2" },
                { attr: "color", value: "green" },
                { attr: "color", value: "blue" },
            ]);
        });

        it("should report nothing once the observer is destroyed", async () => {
            const results: AttributeChange[] = [];
            const element = createMarqueeish();

            mappedMutationObserver.connect(element, attributeRecorder(results), {
                attributes: true,
            });

            element.setAttribute("speed", "2");
            await delivered(results, 1);

            mappedMutationObserver.destroy();

            element.setAttribute("color", "blue");
            await settle();

            expect(results).toEqual([{ attr: "speed", value: "2" }]);
        });
    });
});
