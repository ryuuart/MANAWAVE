import sharedCSS from "./fixtures/shared.css?raw";
import basicHTML from "./fixtures/basic.html?raw";
import basicCSS from "./fixtures/basic.css?raw";
import squareHTML from "./fixtures/square.html?raw";

const ROOT_ID = "test-root";

/**
 * The container every fixture mounts into.
 *
 * It sits behind the page so a fixture can never swallow a pointer event, and
 * it is created lazily so {@link unmountAll} can just throw the whole thing away.
 */
export function testRoot(): HTMLElement {
    const existing = document.getElementById(ROOT_ID);
    if (existing) return existing;

    const root = document.createElement("div");
    root.id = ROOT_ID;
    root.style.position = "relative";
    root.style.zIndex = "-1";
    document.body.append(root);

    return root;
}

function mount(html: string, css: string): HTMLElement {
    const template = document.createElement("template");
    template.innerHTML = html;
    const element = template.content.firstElementChild as HTMLElement;

    testRoot().append(element);

    for (const text of [sharedCSS, css]) {
        if (!text) continue;

        const style = document.createElement("style");
        style.dataset.fixture = "";
        style.textContent = text;
        document.head.append(style);
    }

    return element;
}

/**
 * A lone 100x100 square carrying a 1rem margin, so it measures 132x132
 * once a {@link MeasurementBox} accounts for that margin.
 */
export function mountSquare(): HTMLElement {
    return mount(squareHTML, "");
}

/**
 * A 99vw x 600px marquee holding three squares. Against the 1200x945 viewport
 * configured in `vitest.config.ts` that resolves to 1188x600, wrapping 396x132
 * of repeatable content.
 */
export function mountBasic(): HTMLElement {
    return mount(basicHTML, basicCSS);
}

/** Drops every mounted fixture along with the stylesheets it brought with it. */
export function unmountAll() {
    document.getElementById(ROOT_ID)?.remove();

    for (const style of document.head.querySelectorAll("style[data-fixture]")) {
        style.remove();
    }
}

/**
 * Resolves once the browser has completed a full rendering update.
 *
 * Reach for this only to prove that something did *not* happen — anything that
 * waits on an expected change should poll for that change with `vi.waitFor`.
 */
export function settle(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
}

/** Sleeps for real wall-clock time, for tests that measure elapsed animation. */
export function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
