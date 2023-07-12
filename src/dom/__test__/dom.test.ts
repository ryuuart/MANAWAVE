import Square from "test/pages/square/Square";
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
import TickerComponent from "../components/ticker";
import ItemComponent from "../components/item";
import tickerStyles from "../styles/ticker.module.css";
import itemStyles from "../styles/item.module.css";
import Basic from "test/pages/basic/Basic";
import { Item } from "@manawave/ticker/item";
import { Canvas } from "../canvas";
import { Scene } from "@manawave/ticker/scene";
import Context from "@manawave/ticker/context";
import { Pipeline } from "@manawave/ticker/pipeline";

describe("dom", () => {
    afterEach(() => {
        document.getElementById("test-root")?.replaceChildren();
    });

    describe("unit", () => {
        describe("context", () => {
            it("should initialize a ticker for setup and modification", async () => {
                Basic.loadContent();

                const ctx = Context.setup(Basic.ticker!);

                expect(ctx.root.children).toContain(ctx.itemMBox.element);

                ctx.root.append(ctx.template);

                await expect(await $(ctx.root)).toHaveChildren(4);
            });
        });

        describe("measurement", () => {
            it("should measure a dom element if rendered", async () => {
                Square.loadContent();

                const testElement = Square.square!;
                testElement.style.width = "120px";
                testElement.style.height = "130px";

                // our change in measurement should be observed
                const visibleRect = measure(testElement);

                expect(visibleRect).toEqual({ width: 120, height: 130 });

                testElement.remove();

                const hiddenRect = measure(testElement);

                expect(hiddenRect).toEqual({
                    width: 0,
                    height: 0,
                });
            });

            it("should measure a dom element with margins", async () => {
                Square.loadContent();

                const box = new MeasurementBox(Square.square!);

                box.startMeasuringFrom(document.body);
                expect(box.measurement).toEqual({
                    width: 132,
                    height: 132,
                });
                box.stopMeasuring();
            });

            it("should measure a collection of dom elements", async () => {
                Basic.loadContent();

                const box = new MeasurementBox(...Basic.ticker!.children);

                box.startMeasuringFrom(document.body);
                expect(box.measurement).toEqual({
                    width: 396,
                    height: 132,
                });
                box.stopMeasuring();
            });

            it("should calculate repetitions in different size contexts", async () => {
                const uniformRectLarge = { width: 1000, height: 1000 };
                const uniformRectSmall = { width: 100, height: 100 };
                const nonUniformRectSmall = { width: 123, height: 123 };

                // base uniform case where things fit in perfectly
                const case1 = getRepetitions(
                    uniformRectLarge,
                    uniformRectSmall
                );
                expect(case1).toEqual({ horizontal: 10, vertical: 10 });

                // a repeatable larger than its container should "repeat" 1 time
                const case2 = getRepetitions(
                    uniformRectSmall,
                    uniformRectLarge
                );
                expect(case2).toEqual({ horizontal: 1, vertical: 1 });

                // if they're the same length, it should "repeat" once
                const case3 = getRepetitions(
                    uniformRectSmall,
                    uniformRectSmall
                );
                expect(case3).toEqual({ horizontal: 1, vertical: 1 });

                // an uneven, smaller repeatable should round up to fill the space
                const case4 = getRepetitions(
                    uniformRectLarge,
                    nonUniformRectSmall
                );
                expect(case4).toEqual({ horizontal: 9, vertical: 9 });
            });

            it("should provide accurate dimensions for multiple types", async () => {
                Square.loadContent();
                Basic.loadContent();

                const dimensions = new Dimensions();

                dimensions.setEntry("square", Square.square!);
                expect(dimensions.get("square")).toEqual({
                    width: 100,
                    height: 100,
                });

                dimensions.setEntry("ticker", Basic.ticker!);
                expect(dimensions.get("ticker")).toEqual({
                    width: 1188,
                    height: 600,
                });
            });

            it("should provide accurate dimensions for a measurement box", async () => {
                Square.loadContent();

                const dimensions = new Dimensions();
                const box = new MeasurementBox(Square.square!);
                box.startMeasuringFrom(document.getElementById("test-root")!);

                dimensions.setEntry("square", box);
                expect(dimensions.get("square")).toEqual({
                    width: 132,
                    height: 132,
                });

                box.stopMeasuring();
            });

            it("should provide accurate dimensions when a resize occurs", async () => {
                Square.loadContent();
                Basic.loadContent();

                const dimensions = new Dimensions();

                const squareLog: Rect[] = [];

                dimensions.setEntry("square", Square.square!, (rect) => {
                    squareLog.push(rect);
                });
                dimensions.setEntry("ticker", Basic.ticker!);

                // square's size should remain the same even though ticker's size changed
                Basic.ticker!.style.width = "100px";
                await $(Basic.ticker!).waitUntil(async function () {
                    // @ts-ignore
                    return (await this.getSize("width")) === 100;
                });
                expect(squareLog[0].width).toBe(100);

                // square's size should be different when square's size changed
                Square.square!.style.width = "300px";
                Square.square!.style.height = "500px";
                await $(Square.square!).waitUntil(async function () {
                    return (
                        // @ts-ignore
                        (await this.getSize("width")) === 300 &&
                        // @ts-ignore
                        (await this.getSize("height")) === 500
                    );
                });
                expect(squareLog[1]).toEqual({ width: 300, height: 500 });
            });
        });

        describe("attribute", () => {
            it("convert strings to angle degrees", async () => {
                const direction1 = "up";
                expect(convertDirection(direction1)).toEqual(90);

                const direction2 = "right";
                expect(convertDirection(direction2)).toEqual(0);

                const direction3 = "down";
                expect(convertDirection(direction3)).toEqual(270);

                const direction4 = "left";
                expect(convertDirection(direction4)).toEqual(180);

                const direction5 = "123456";
                expect(convertDirection(direction5)).toEqual(123456);

                const direction6 = "potato";
                expect(convertDirection(direction6)).toEqual(0);
            });

            it("should extract ticker options from html element atttributes", async () => {
                Square.loadContent();

                const element = Square.square;
                element?.setAttribute("speed", "123");
                element?.setAttribute("direction", "up");
                element?.setAttribute("autoplay", "");

                expect(extractOAttributes(element!)).toEqual({
                    autoplay: true,
                    speed: 123,
                    direction: "up",
                });
            });

            it("should merge options provided by html attributes or javascript", async () => {
                Square.loadContent();

                const element = Square.square;
                element?.setAttribute("speed", "123");
                element?.setAttribute("direction", "down");
                element?.setAttribute("autoplay", "false");

                expect(mergeOOptions(element!)).toEqual({
                    autoplay: false,
                    speed: 123,
                    direction: "down",
                });

                expect(mergeOOptions(element!, { autoplay: true })).toEqual({
                    autoplay: true,
                    speed: 123,
                    direction: "down",
                });

                expect(mergeOOptions(element!, { speed: 500 })).toEqual({
                    autoplay: false,
                    speed: 500,
                    direction: "down",
                });

                expect(mergeOOptions(element!, { direction: 123 })).toEqual({
                    autoplay: false,
                    speed: 123,
                    direction: 123,
                });
            });

            it("should always return the most up-to-date attribute", async () => {
                Square.loadContent();

                const attr = new Attributes(Square.square!);

                expect(attr.autoplay).toEqual(false);
                expect(attr.speed).toEqual(1);
                expect(attr.direction).toEqual(0);

                // does changing attributes work?
                Square.square!.setAttribute("autoplay", "true");
                await $(Square.square!).waitUntil(async function () {
                    //@ts-ignore
                    return (await this.getAttribute("autoplay")) === "true";
                });
                expect(attr.autoplay).toEqual(true);

                Square.square!.setAttribute("speed", "999");
                await $(Square.square!).waitUntil(async function () {
                    //@ts-ignore
                    return (await this.getAttribute("speed")) === "999";
                });
                expect(attr.speed).toEqual(999);

                Square.square!.setAttribute("direction", "999");
                await $(Square.square!).waitUntil(async function () {
                    //@ts-ignore
                    return (await this.getAttribute("direction")) === "999";
                });
                expect(attr.direction).toEqual(999);
            });

            it("should react to changes in option override", async () => {
                Square.loadContent();

                const attr = new Attributes(Square.square!, {
                    speed: 123,
                    direction: 123,
                });

                // does override work?
                Square.square!.setAttribute("speed", "999");
                await $(Square.square!).waitUntil(async function () {
                    //@ts-ignore
                    return (await this.getAttribute("speed")) === "999";
                });
                expect(attr.speed).toEqual(123);

                Square.square!.setAttribute("direction", "999");
                await $(Square.square!).waitUntil(async function () {
                    //@ts-ignore
                    return (await this.getAttribute("direction")) === "999";
                });
                expect(attr.direction).toEqual(123);

                // updated options should override element attributes
                attr.update({ direction: "up" });
                Square.square!.setAttribute("direction", "360");
                await $(Square.square!).waitUntil(async function () {
                    //@ts-ignore
                    return (await this.getAttribute("direction")) === "360";
                });
                expect(attr.direction).toEqual(90);
            });

            it("should notify a change", async () => {
                Square.loadContent();

                let testDirection = 0;
                const attr = new Attributes(Square.square!);
                attr.onUpdate = ({ direction }) => {
                    testDirection = direction;
                };

                Square.square!.setAttribute("direction", "left");
                await $(Square.square!).waitUntil(async function () {
                    //@ts-ignore
                    return (await this.getAttribute("direction")) === "left";
                });
                expect(testDirection).toEqual(180);
            });
        });

        describe("component", () => {
            it("can be rendered on the DOM", async () => {
                // create an example element and fragment
                const element1 = document.createElement("div");
                element1.id = "element";

                const fragment = new DocumentFragment();

                const component = new TickerComponent();

                // can it append to an element and render it?
                component.appendToDOM(element1);
                document.getElementById("test-root")!.append(element1);

                await expect(
                    await $(`#${element1.id}`).$(`.${tickerStyles.container}`)
                ).toExist();

                // can it append to a fragment and render it?
                component.appendToDOM(fragment);
                document.getElementById("test-root")!.append(fragment);

                await expect(await $(`.${tickerStyles.container}`)).toExist();
            });
        });

        describe("canvas", () => {
            it("should create new item components", async () => {
                const testParent = document.createElement("div");
                const root = new TickerComponent();
                root.appendToDOM(testParent);
                const template = new DocumentFragment();
                const canvas = new Canvas(root, template);

                canvas.createItemComponents([
                    new Item(),
                    new Item(),
                    new Item(),
                ]);

                // we append root to testParent for firstElementChild
                // we see if the root does have 3 children we just made
                expect(testParent.firstElementChild!.children.length).toEqual(
                    3
                );
            });

            it("should update root component size", async () => {
                const root = new TickerComponent();
                const template = new DocumentFragment();
                const canvas = new Canvas(root, template);

                canvas.updateRootComponent({ width: 999, height: 999 });

                expect(root.size).toEqual({ width: 999, height: 999 });
            });

            it("should update a given ItemComponent with new data", async () => {
                const root = new TickerComponent();
                const template = new DocumentFragment();
                const canvas = new Canvas(root, template);

                const item = new Item(undefined, { width: 999, height: 999 });
                const itemComponent = new ItemComponent(item);

                item.position = { x: 999, y: 999 };
                canvas.setItemComponent(itemComponent, item);

                expect(itemComponent.size).toEqual({ width: 999, height: 999 });
                expect(itemComponent.position).toEqual({ x: 999, y: 999 });
            });
        });

        describe("pipeline", () => {
            it("should override the item template clone when it's created", async () => {
                Square.loadContent();

                // modify background to be red
                const pipeline = new Pipeline();
                pipeline.onElementCreated = ({ element }) => {
                    element.style.backgroundColor = "red";
                };

                // set up a naive ticker
                const ticker = new TickerComponent();
                ticker.setSize({ width: 999, height: 999 });
                ticker.appendToDOM(document.getElementById("test-root")!);
                const template = new DocumentFragment();
                template.append(Square.square!);
                const canvas = new Canvas(ticker, template, pipeline);

                // create and render the item with override
                canvas.createItemComponents([new Item()]);

                // does it actually have the red color
                const element = await $(`.${itemStyles.item} > *`);
                await expect(element).toHaveStyle({
                    backgroundColor: "rgba(255,0,0,1)",
                });
            });
        });
    });

    describe("integration", () => {
        describe("context", () => {
            it("should update its root size", async () => {
                Basic.loadContent();

                const ctx = Context.setup(Basic.ticker!);
                const sizes = ctx.sizes;

                // initial size is right
                expect(sizes.root).toEqual({ height: 600, width: 1188 });

                // trigger a change
                Basic.ticker!.style.width = "600px";
                await $(Basic.ticker!).waitUntil(async function () {
                    //@ts-ignore
                    return (await this.getSize("width")) === 600;
                });

                // have to wait for the debounce
                await browser.pause(300);

                // changed size is right
                expect(sizes.root).toEqual({ height: 600, width: 600 });
            });

            it("should update its attributes", async () => {
                Basic.loadContent();

                const ctx = Context.setup(Basic.ticker!);
                const attr = ctx.attributes;

                expect(attr.direction).toEqual(0);

                Basic.ticker!.setAttribute("direction", "left");
                await $(Basic.ticker!).waitUntil(async function () {
                    //@ts-ignore
                    return (await this.getAttribute("direction")) === "left";
                });
                expect(attr.direction).toEqual(180);
            });
        });

        describe("component", () => {
            it("should update its size on the page given new data", async () => {
                const ticker = new TickerComponent();
                ticker.appendToDOM(document.getElementById("test-root")!);

                // set its size once
                ticker.setSize({ width: 999, height: 999 });
                await $(`.${tickerStyles.container}`).waitUntil(
                    async function () {
                        // @ts-ignore
                        const size = await this.getSize();

                        return size.width === 999 && size.height === 999;
                    }
                );

                await expect(
                    await $(`.${tickerStyles.container}`).getSize("width")
                ).toEqual(999);
                await expect(
                    await $(`.${tickerStyles.container}`).getSize("height")
                ).toEqual(999);

                // do it again
                ticker.setSize({ width: 100, height: 100 });
                await $(`.${tickerStyles.container}`).waitUntil(
                    async function () {
                        // @ts-ignore
                        const size = await this.getSize();

                        return size.width === 100 && size.height === 100;
                    }
                );

                await expect(
                    await $(`.${tickerStyles.container}`).getSize("width")
                ).toEqual(100);
                await expect(
                    await $(`.${tickerStyles.container}`).getSize("height")
                ).toEqual(100);
            });

            it("should position an item element on the page", async () => {
                // create a base item
                const item = new ItemComponent(new Item());

                // add to the DOM to observe changes
                item.appendToDOM(document.getElementById("test-root")!);
                item.setPosition({ x: 100, y: 100 });

                // wait until its position is actually updated
                await $(`.${itemStyles.item}`).waitUntil(async function () {
                    // @ts-ignore
                    const location = await this.getCSSProperty("transform");

                    return location.value === "matrix(1, 0, 0, 1, 100, 100)";
                });

                // did it update?
                await expect(
                    (
                        await $(`.${itemStyles.item}`).getCSSProperty(
                            "transform"
                        )
                    ).value
                ).toEqual("matrix(1, 0, 0, 1, 100, 100)");
            });

            it("should render new items on a TickerComponent", async () => {
                // setup
                Square.loadContent();

                const component = new TickerComponent();
                component.appendToDOM(document.getElementById("test-root")!);

                // it shouldn't have anything initially
                await expect(
                    await $(`.${tickerStyles.container}`)
                ).not.toHaveChildren();

                // create the "payload"
                const template = Square.square!;
                template.remove();
                const fragment = new DocumentFragment();
                fragment.append(template.cloneNode(true));
                fragment.append(template.cloneNode(true));
                fragment.append(template.cloneNode(true));
                fragment.append(template.cloneNode(true));
                fragment.append(template.cloneNode(true));

                // add new items
                component.appendChildDOM(fragment);

                // did the new items render?
                await expect(
                    await $(`.${tickerStyles.container}`)
                ).toHaveChildren();
            });
        });

        describe("canvas", () => {
            it("should clean buffers when swapping", async () => {
                const testParent = document.createElement("div");
                const root = new TickerComponent();
                root.appendToDOM(testParent);
                const template = new DocumentFragment();
                const canvas = new Canvas(root, template);

                canvas.createItemComponents([
                    new Item(),
                    new Item(),
                    new Item(),
                ]);

                // clears 1 buffer
                canvas.swapBuffer();
                // clears the other
                canvas.swapBuffer();

                expect(testParent.firstElementChild!.children.length).toEqual(
                    0
                );
            });

            it("should remove dead components", async () => {
                const testParent = document.createElement("div");
                const root = new TickerComponent();
                root.appendToDOM(testParent);
                const template = new DocumentFragment();
                const canvas = new Canvas(root, template);

                canvas.createItemComponents([
                    new Item(),
                    new Item(),
                    new Item(),
                ]);

                // sets the newly created items to be inactive
                canvas.swapBuffer();
                // none of the created items are drawn to the active buffer
                // so they should be removed
                canvas.clearDeadComponents();

                expect(testParent.firstElementChild!.children.length).toEqual(
                    0
                );
            });

            it("should draw a scene and update it", async () => {
                Basic.loadContent();

                const domRoot = Basic.ticker!;
                const template = new DocumentFragment();
                template.append(...domRoot.children);

                const root = new TickerComponent();
                root.appendToDOM(domRoot);

                const canvas = new Canvas(root, template);
                const scene = new Scene();
                scene.add(new Item());

                canvas.draw(scene);

                // did it draw our item
                let itemPosition = async () =>
                    (
                        await $(
                            domRoot.firstElementChild!
                                .children[0] as HTMLElement
                        ).getCSSProperty("transform")
                    ).value;

                await expect(
                    await $(domRoot.firstElementChild! as HTMLElement)
                ).toHaveChildren();
                await expect(await itemPosition()).toEqual(
                    "matrix(1, 0, 0, 1, 0, 0)"
                );

                // lets draw an update on our scene, does it update
                for (const items of scene.contents) {
                    items.size = { width: 99, height: 99 };
                    items.position = { x: 999, y: 999 };
                }
                scene.size = { width: 999, height: 999 };
                canvas.draw(scene);

                // have to wait for debounce
                await browser.pause(300);

                await expect(await itemPosition()).toEqual(
                    "matrix(1, 0, 0, 1, 999, 999)"
                );
                await expect(
                    await (
                        await $(domRoot.firstElementChild! as HTMLElement)
                    ).getSize()
                ).toEqual({ width: 999, height: 999 });
                await expect(
                    await (
                        await $(
                            domRoot.firstElementChild!
                                .children[0]! as HTMLElement
                        )
                    ).getSize()
                ).toEqual({ width: 99, height: 99 });

                // lets add a new item, does it have the right amount?
                scene.add(new Item());
                canvas.draw(scene);

                await expect(
                    await $(domRoot.firstElementChild! as HTMLElement)
                ).toHaveChildren(2);

                // lets remove everything, does it have the right amount?
                for (const item of scene.contents) {
                    scene.delete(item);
                }
                canvas.draw(scene);

                await expect(
                    await $(domRoot.firstElementChild! as HTMLElement)
                ).not.toHaveChildren();
            });
        });
    });
});
