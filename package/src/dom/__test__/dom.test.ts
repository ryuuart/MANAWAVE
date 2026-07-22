import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import { mountBasic, mountSquare, testRoot, unmountAll } from "test/fixtures";
import {
    Dimensions,
    MeasurementBox,
    getRepetitions,
    measure,
} from "../measure";
import {
    Attributes,
    convertDirection,
    extractOAttributes,
    mergeOOptions,
} from "../attributes";
import MarqueeComponent from "../components/marquee";
import ItemComponent from "../components/item";
import marqueeStyles from "../styles/marquee.module.css";
import itemStyles from "../styles/item.module.css";
import { Item } from "@manawave/marquee/item";
import { Canvas } from "../canvas";
import { Scene } from "@manawave/marquee/scene";
import Context from "@manawave/marquee/context";
import { Pipeline } from "@manawave/marquee/pipeline";
import Controller from "@manawave/marquee/controller";
import WebComponent from "../element";

/** The rendered size of an element, matching the shape of a {@link Rect}. */
function boxOf(element: Element): Rect {
    const { width, height } = element.getBoundingClientRect();

    return { width, height };
}

/** The transform matrix an element is currently rendered with. */
function transformOf(element: Element): string {
    return getComputedStyle(element).transform;
}

function query(selector: string): HTMLElement {
    const element = document.querySelector<HTMLElement>(selector);
    expect(element, `no element matched ${selector}`).not.toBeNull();

    return element!;
}

describe("dom", () => {
    // several measurements below assert exact pixel values against a marquee
    // sized in viewport units, so the viewport itself has to be pinned
    beforeAll(async () => {
        await page.viewport(1200, 945);
    });

    afterEach(() => {
        unmountAll();
    });

    describe("unit", () => {
        describe("context", () => {
            it("should initialize a marquee for setup and modification", () => {
                const marquee = mountBasic();

                const ctx = Context.setup(marquee);

                expect(ctx.root.children).toContain(ctx.itemMBox.element);

                ctx.root.append(ctx.template);

                expect(ctx.root.children).toHaveLength(4);
            });

            it("should override the attributes actively", () => {
                const marquee = mountBasic();

                // run through a set of starting values
                for (let i = 0; i <= 10; i++) {
                    marquee.dataset.direction = "999";
                    marquee.dataset.speed = "999";
                    marquee.dataset.autoplay = "true";

                    const ctx = Context.setup(marquee);

                    // change from the default through another comprehensive set of values
                    for (let j = 0; j <= 360; j++) {
                        ctx.attributes = {
                            direction: j,
                            speed: j,
                            autoplay: false,
                        };

                        expect(ctx.attributes.direction).toEqual(j);
                        expect(ctx.attributes.speed).toEqual(j);
                        expect(ctx.attributes.autoplay).toEqual(false);
                    }
                }
            });

            it("should pre-process marquees that have raw text content", () => {
                // testing equality in content because the references to the original nodes
                // aren't going to be the same as things get processed
                // elements with only text nodes, nothing else
                const onlyTextElement = document.createElement("div");
                const onlyTextNodes = [
                    document.createTextNode("first line"),
                    document.createTextNode("second line"),
                ];
                onlyTextElement.append(...onlyTextNodes);

                // we test position directly because the node order MUST be maintained
                const onlyTextContext = Context.setup(onlyTextElement);
                expect(
                    onlyTextContext.template.children[0].textContent
                ).toEqual(onlyTextNodes[0].textContent);
                expect(
                    onlyTextContext.template.children[1].textContent
                ).toEqual(onlyTextNodes[1].textContent);

                // elements with a mixture of text nodes and element nodes
                const mixedTextElement = document.createElement("div");
                const mixedTextNodes = [
                    document.createTextNode("first line"),
                    document.createElement("div"),
                    document.createTextNode("second line"),
                ];
                mixedTextElement.append(...mixedTextNodes);

                const mixedTextContext = Context.setup(mixedTextElement);
                expect(
                    mixedTextContext.template.children[0].textContent
                ).toEqual(mixedTextNodes[0].textContent);
                expect(mixedTextContext.template.children[1]).toBeInstanceOf(
                    HTMLDivElement
                );
                expect(
                    mixedTextContext.template.children[2].textContent
                ).toEqual(mixedTextNodes[2].textContent);
            });

            it("should not initialize empty containers", () => {
                // should prevent an empty marquee in general
                const emptyElement = document.createElement("div");
                expect(() => Context.setup(emptyElement)).toThrow(/empty/);

                // should prevent whitespace
                const whitespaceElement = document.createElement("div");
                whitespaceElement.append(document.createTextNode(" "));
                whitespaceElement.append(document.createTextNode(" "));
                whitespaceElement.append(document.createTextNode(" "));
                expect(() => Context.setup(whitespaceElement)).toThrow(/empty/);

                // should prevent special whitespace characters too
                const specialWhitespaceElement = document.createElement("div");
                specialWhitespaceElement.innerHTML = "&nbsp;";
                expect(() => Context.setup(specialWhitespaceElement)).toThrow(
                    /empty/
                );
            });
        });

        describe("measurement", () => {
            it("should measure a dom element if rendered", () => {
                const square = mountSquare();
                square.style.width = "120px";
                square.style.height = "130px";

                // our change in measurement should be observed
                expect(measure(square)).toEqual({ width: 120, height: 130 });

                square.remove();

                expect(measure(square)).toEqual({ width: 0, height: 0 });
            });

            it("should measure a dom element with margins", () => {
                const box = new MeasurementBox(mountSquare());

                box.startMeasuringFrom(document.body);
                expect(box.measurement).toEqual({ width: 132, height: 132 });
                box.stopMeasuring();
            });

            it("should measure a collection of dom elements", () => {
                const box = new MeasurementBox(...mountBasic().children);

                box.startMeasuringFrom(document.body);
                expect(box.measurement).toEqual({ width: 396, height: 132 });
                box.stopMeasuring();
            });

            it("should calculate repetitions in different size contexts", () => {
                const uniformRectLarge = { width: 1000, height: 1000 };
                const uniformRectSmall = { width: 100, height: 100 };
                const nonUniformRectSmall = { width: 123, height: 123 };

                // base uniform case where things fit in perfectly
                expect(
                    getRepetitions(uniformRectLarge, uniformRectSmall)
                ).toEqual({ horizontal: 10, vertical: 10 });

                // a repeatable larger than its container should "repeat" 1 time
                expect(
                    getRepetitions(uniformRectSmall, uniformRectLarge)
                ).toEqual({ horizontal: 1, vertical: 1 });

                // if they're the same length, it should "repeat" once
                expect(
                    getRepetitions(uniformRectSmall, uniformRectSmall)
                ).toEqual({ horizontal: 1, vertical: 1 });

                // an uneven, smaller repeatable should round up to fill the space
                expect(
                    getRepetitions(uniformRectLarge, nonUniformRectSmall)
                ).toEqual({ horizontal: 9, vertical: 9 });
            });

            it("should provide accurate dimensions for multiple types", () => {
                const square = mountSquare();
                const marquee = mountBasic();

                const dimensions = new Dimensions();

                dimensions.setEntry("square", square);
                expect(dimensions.get("square")).toEqual({
                    width: 100,
                    height: 100,
                });

                dimensions.setEntry("marquee", marquee);
                expect(dimensions.get("marquee")).toEqual({
                    width: 1188,
                    height: 600,
                });
            });

            it("should provide accurate dimensions for a measurement box", () => {
                const dimensions = new Dimensions();
                const box = new MeasurementBox(mountSquare());
                box.startMeasuringFrom(testRoot());

                dimensions.setEntry("square", box);
                expect(dimensions.get("square")).toEqual({
                    width: 132,
                    height: 132,
                });

                box.stopMeasuring();
            });

            it("should provide accurate dimensions when a resize occurs", async () => {
                const square = mountSquare();
                const marquee = mountBasic();

                const dimensions = new Dimensions();
                const squareLog: Rect[] = [];

                dimensions.setEntry("square", square, (rect) => {
                    squareLog.push(rect);
                });
                dimensions.setEntry("marquee", marquee);

                // square's size should remain the same even though marquee's size changed
                marquee.style.width = "100px";
                await vi.waitFor(() => expect(squareLog).toHaveLength(1));
                expect(squareLog[0].width).toBe(100);

                // square's size should be different when square's size changed
                square.style.width = "300px";
                square.style.height = "500px";
                await vi.waitFor(() => expect(squareLog).toHaveLength(2));
                expect(squareLog[1]).toEqual({ width: 300, height: 500 });
            });
        });

        describe("attribute", () => {
            it("convert strings to angle degrees", () => {
                expect(convertDirection("up")).toEqual(90);
                expect(convertDirection("right")).toEqual(0);
                expect(convertDirection("down")).toEqual(270);
                expect(convertDirection("left")).toEqual(180);
                expect(convertDirection("123456")).toEqual(123456);
                expect(convertDirection("potato")).toEqual(0);
            });

            it("should extract marquee options from html element atttributes", () => {
                // for regular element
                const regularElement = mountSquare();
                regularElement.dataset.speed = "123";
                regularElement.dataset.direction = "up";
                regularElement.dataset.autoplay = "";

                expect(extractOAttributes(regularElement)).toEqual({
                    autoplay: true,
                    speed: 123,
                    direction: "up",
                });

                // for custom element, which has to be defined first
                if (!customElements.get("manawave-ticker")) {
                    customElements.define("manawave-ticker", WebComponent);
                }
                const customElement = document.createElement("manawave-ticker");
                customElement.setAttribute("speed", "123");
                customElement.setAttribute("direction", "up");
                customElement.setAttribute("autoplay", "");

                expect(extractOAttributes(customElement)).toEqual({
                    autoplay: true,
                    speed: 123,
                    direction: "up",
                });
            });

            it("should merge options provided by html attributes or javascript", () => {
                const element = mountSquare();
                element.dataset.speed = "123";
                element.dataset.direction = "down";
                element.dataset.autoplay = "false";

                expect(mergeOOptions(element)).toEqual({
                    autoplay: false,
                    speed: 123,
                    direction: "down",
                });

                expect(mergeOOptions(element, { autoplay: true })).toEqual({
                    autoplay: true,
                    speed: 123,
                    direction: "down",
                });

                expect(mergeOOptions(element, { speed: 500 })).toEqual({
                    autoplay: false,
                    speed: 500,
                    direction: "down",
                });

                expect(mergeOOptions(element, { direction: 123 })).toEqual({
                    autoplay: false,
                    speed: 123,
                    direction: 123,
                });
            });

            it("should always return the most up-to-date attribute", async () => {
                const square = mountSquare();
                const attr = new Attributes(square);

                expect(attr.autoplay).toEqual(false);
                expect(attr.speed).toEqual(1);
                expect(attr.direction).toEqual(0);

                square.dataset.autoplay = "true";
                await vi.waitFor(() => expect(attr.autoplay).toEqual(true));

                square.dataset.speed = "999";
                await vi.waitFor(() => expect(attr.speed).toEqual(999));

                square.dataset.direction = "999";
                await vi.waitFor(() => expect(attr.direction).toEqual(999));
            });

            it("should react to changes in option override", async () => {
                const square = mountSquare();
                const attr = new Attributes(square, {
                    speed: 123,
                    direction: 123,
                });

                // an override wins over whatever the element says
                square.dataset.speed = "999";
                square.dataset.direction = "999";
                expect(attr.speed).toEqual(123);
                expect(attr.direction).toEqual(123);

                // updated options should override element attributes
                attr.update({ direction: "up" });
                square.dataset.direction = "360";
                await vi.waitFor(() => expect(attr.direction).toEqual(90));
            });

            it("should notify a change", async () => {
                const square = mountSquare();

                let testDirection = 0;
                const attr = new Attributes(square);
                attr.onUpdate = ({ direction }) => {
                    testDirection = direction;
                };

                square.dataset.direction = "left";
                await vi.waitFor(() => expect(testDirection).toEqual(180));
            });
        });

        describe("component", () => {
            it("can be rendered on the DOM", () => {
                const host = document.createElement("div");
                host.id = "element";

                const fragment = new DocumentFragment();
                const component = new MarqueeComponent();

                // can it append to an element and render it?
                component.appendToDOM(host);
                testRoot().append(host);

                expect(
                    host.querySelector(`.${marqueeStyles.container}`)
                ).not.toBeNull();

                // can it append to a fragment and render it?
                component.appendToDOM(fragment);
                testRoot().append(fragment);

                expect(
                    document.querySelector(`.${marqueeStyles.container}`)
                ).not.toBeNull();
            });
        });

        describe("canvas", () => {
            it("should create new item components", () => {
                const testParent = document.createElement("div");
                const root = new MarqueeComponent();
                root.appendToDOM(testParent);
                const canvas = new Canvas(root, new DocumentFragment());

                canvas.createItemComponents([
                    new Item(),
                    new Item(),
                    new Item(),
                ]);

                // we append root to testParent for firstElementChild
                // we see if the root does have 3 children we just made
                expect(testParent.firstElementChild!.children).toHaveLength(3);
            });

            it("should update root component size", () => {
                const root = new MarqueeComponent();
                const canvas = new Canvas(root, new DocumentFragment());

                canvas.updateRootComponent({ width: 999, height: 999 });

                expect(root.size).toEqual({ width: 999, height: 999 });
            });

            it("should update a given ItemComponent with new data", () => {
                const root = new MarqueeComponent();
                const canvas = new Canvas(root, new DocumentFragment());

                const item = new Item(undefined, { width: 999, height: 999 });
                const itemComponent = new ItemComponent(item);

                item.position = { x: 999, y: 999 };
                canvas.setItemComponent(itemComponent, item);

                expect(itemComponent.size).toEqual({ width: 999, height: 999 });
                expect(itemComponent.position).toEqual({ x: 999, y: 999 });
            });
        });

        describe("pipeline", () => {
            /** A bare marquee canvas rendering clones of the square fixture. */
            function mountCanvas(pipeline: Pipeline): Canvas {
                const marquee = new MarqueeComponent();
                marquee.setSize({ width: 999, height: 999 });
                marquee.appendToDOM(testRoot());

                const template = new DocumentFragment();
                template.append(mountSquare());

                return new Canvas(marquee, template, pipeline);
            }

            it("should override the item template clone when it's created", () => {
                const pipeline = new Pipeline();
                pipeline.onElementCreated = ({ element }) => {
                    element.style.backgroundColor = "red";
                };

                mountCanvas(pipeline).createItemComponents([new Item()]);

                expect(
                    getComputedStyle(query(`.${itemStyles.item} > *`))
                        .backgroundColor
                ).toMatch(/rgba?\(255, *0, *0(, *1)?\)/);
            });

            it("should override the item template clone each time it's drawn", () => {
                const pipeline = new Pipeline();
                pipeline.onElementDraw = ({ element, t }) => {
                    element.style.opacity = `${Math.cos(t * 0.001)}`;
                };

                const canvas = mountCanvas(pipeline);

                const currentOpacity = () =>
                    Number(
                        getComputedStyle(query(`.${itemStyles.item} > *`))
                            .opacity
                    );

                // need a basic scene
                const scene = new Scene();
                scene.add(new Item());

                canvas.draw(scene);
                expect(currentOpacity()).toBeCloseTo(1);

                // simulate some time
                for (let t = 0, dt = 100; t < 300; t += dt) {
                    for (const item of scene.contents) {
                        item.timestamp = { dt, t };
                    }
                    canvas.draw(scene);
                }
                expect(currentOpacity()).toBeCloseTo(0.980067);

                // simulate more time
                for (let t = 300, dt = 100; t < 600; t += dt) {
                    for (const item of scene.contents) {
                        item.timestamp = { dt, t };
                    }
                    canvas.draw(scene);
                }
                expect(currentOpacity()).toBeCloseTo(0.877583);
            });

            it("should allow users to cleanup dead references when an item is removed", () => {
                let destroyedRef;
                let createdRef;

                const pipeline = new Pipeline();
                pipeline.onElementCreated = ({ id }) => {
                    createdRef = id;
                };
                pipeline.onElementDestroyed = ({ id }) => {
                    destroyedRef = id;
                };

                const canvas = mountCanvas(pipeline);

                canvas.createItemComponents([new Item()]);
                canvas.swapBuffer();
                canvas.clearDeadComponents();

                // the element that got destroyed is the one that got created
                expect(createdRef).toEqual(destroyedRef);

                canvas.createItemComponents([new Item()]);

                expect(createdRef).not.toEqual(destroyedRef);
            });
        });
    });

    describe("integration", () => {
        describe("context", () => {
            it("should update its root size", async () => {
                const marquee = mountBasic();
                const { sizes } = Context.setup(marquee);

                // initial size is right
                expect(sizes.root).toEqual({ height: 600, width: 1188 });

                marquee.style.width = "600px";

                // the resize is debounced before it reaches the context
                await vi.waitFor(() =>
                    expect(sizes.root).toEqual({ height: 600, width: 600 })
                );
            });

            it("should update its attributes", async () => {
                const marquee = mountBasic();
                const { attributes } = Context.setup(marquee);

                expect(attributes.direction).toEqual(0);

                marquee.dataset.direction = "left";

                await vi.waitFor(() =>
                    expect(attributes.direction).toEqual(180)
                );
            });
        });

        describe("component", () => {
            it("should update its size on the page given new data", () => {
                const marquee = new MarqueeComponent();
                marquee.appendToDOM(testRoot());

                marquee.setSize({ width: 999, height: 999 });
                expect(boxOf(query(`.${marqueeStyles.container}`))).toEqual({
                    width: 999,
                    height: 999,
                });

                marquee.setSize({ width: 100, height: 100 });
                expect(boxOf(query(`.${marqueeStyles.container}`))).toEqual({
                    width: 100,
                    height: 100,
                });
            });

            it("should position an item element on the page", () => {
                const item = new ItemComponent(new Item());

                item.appendToDOM(testRoot());
                item.setPosition({ x: 100, y: 100 });

                expect(transformOf(query(`.${itemStyles.item}`))).toEqual(
                    "matrix(1, 0, 0, 1, 100, 100)"
                );
            });

            it("should render new items on a MarqueeComponent", () => {
                const square = mountSquare();

                const component = new MarqueeComponent();
                component.appendToDOM(testRoot());

                // it shouldn't have anything initially
                const container = query(`.${marqueeStyles.container}`);
                expect(container.children).toHaveLength(0);

                // create the "payload"
                square.remove();
                const fragment = new DocumentFragment();
                for (let i = 0; i < 5; i++) {
                    fragment.append(square.cloneNode(true));
                }

                component.appendChildDOM(fragment);

                expect(container.children).toHaveLength(5);
            });
        });

        describe("canvas", () => {
            it("should clean buffers when swapping", () => {
                const testParent = document.createElement("div");
                const root = new MarqueeComponent();
                root.appendToDOM(testParent);
                const canvas = new Canvas(root, new DocumentFragment());

                canvas.createItemComponents([
                    new Item(),
                    new Item(),
                    new Item(),
                ]);

                // clears 1 buffer, then the other
                canvas.swapBuffer();
                canvas.swapBuffer();

                expect(testParent.firstElementChild!.children).toHaveLength(0);
            });

            it("should remove dead components", () => {
                const testParent = document.createElement("div");
                const root = new MarqueeComponent();
                root.appendToDOM(testParent);
                const canvas = new Canvas(root, new DocumentFragment());

                canvas.createItemComponents([
                    new Item(),
                    new Item(),
                    new Item(),
                ]);

                // sets the newly created items to be inactive, so none of them
                // are drawn to the active buffer and all of them get removed
                canvas.swapBuffer();
                canvas.clearDeadComponents();

                expect(testParent.firstElementChild!.children).toHaveLength(0);
            });

            it("should draw a scene and update it", () => {
                const domRoot = mountBasic();
                const template = new DocumentFragment();
                template.append(...domRoot.children);

                const root = new MarqueeComponent();
                root.appendToDOM(domRoot);

                const canvas = new Canvas(root, template);
                const scene = new Scene();
                scene.add(new Item());

                canvas.draw(scene);

                const container = domRoot.firstElementChild!;
                const firstItem = () => container.children[0]!;

                // did it draw our item
                expect(container.children).toHaveLength(1);
                expect(transformOf(firstItem())).toEqual(
                    "matrix(1, 0, 0, 1, 0, 0)"
                );

                // lets draw an update on our scene, does it update
                for (const item of scene.contents) {
                    item.size = { width: 99, height: 99 };
                    item.position = { x: 999, y: 999 };
                }
                scene.size = { width: 999, height: 999 };
                canvas.draw(scene);

                expect(transformOf(firstItem())).toEqual(
                    "matrix(1, 0, 0, 1, 999, 999)"
                );
                expect(boxOf(container)).toEqual({ width: 999, height: 999 });
                expect(boxOf(firstItem())).toEqual({ width: 99, height: 99 });

                // lets add a new item, does it have the right amount?
                scene.add(new Item());
                canvas.draw(scene);
                expect(container.children).toHaveLength(2);

                // lets remove everything, does it have the right amount?
                for (const item of scene.contents) {
                    scene.delete(item);
                }
                canvas.draw(scene);
                expect(container.children).toHaveLength(0);
            });
        });

        describe("pipeline", () => {
            it("should arbitrarily operate on all item elements in the marquee", () => {
                const controller = new Controller(Context.setup(mountBasic()));

                // starting is what fills the marquee, so there is something
                // for the hook to reach in the first place
                controller.start();

                controller.eachElement(({ element }) => {
                    element.style.backgroundColor = "red";
                });

                const elements = document.querySelectorAll(
                    `.${itemStyles.item} > *`
                );
                expect(elements.length).toBeGreaterThan(0);

                for (const element of elements) {
                    expect(getComputedStyle(element).backgroundColor).toMatch(
                        /rgba?\(255, *0, *0(, *1)?\)/
                    );
                }

                controller.stop();
            });
        });
    });
});
