import Square from "test/pages/square/Square";
import {
    Dimensions,
    MeasurementBox,
    getRepetitions,
    measure,
} from "../measure";
import {
    convertDirection,
    extractOAttributes,
    mergeOOptions,
} from "../attributes";
import ContainerComponent from "../components/container";
import ItemComponent from "../components/item";
import tickerStyles from "../styles/ticker.module.css";
import itemStyles from "../styles/item.module.css";
import TemplateComponent from "../components/template";
import Basic from "test/pages/basic/Basic";
import TickerWorld from "../world";
import { Item } from "@ouroboros/ticker/item";
import { Container } from "@ouroboros/ticker/container";

describe("dom", () => {
    beforeEach(() => {
        Square.loadContent();
        Basic.loadContent();
    });
    afterEach(() => {
        document.getElementById("test-root")?.replaceChildren();
    });

    describe("measurement", async () => {
        it("should measure a dom element if rendered", async () => {
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
            const box = new MeasurementBox(Square.square!);

            box.startMeasuringFrom(document.body);
            expect(box.measurement).toEqual({
                width: 132,
                height: 132,
            });
            box.stopMeasuring();
        });

        it("should measure a collection of dom elements", async () => {
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
            const case1 = getRepetitions(uniformRectLarge, uniformRectSmall);
            expect(case1).toEqual({ horizontal: 10, vertical: 10 });

            // a repeatable larger than its container should "repeat" 1 time
            const case2 = getRepetitions(uniformRectSmall, uniformRectLarge);
            expect(case2).toEqual({ horizontal: 1, vertical: 1 });

            // if they're the same length, it should "repeat" once
            const case3 = getRepetitions(uniformRectSmall, uniformRectSmall);
            expect(case3).toEqual({ horizontal: 1, vertical: 1 });

            // an uneven, smaller repeatable should round up to fill the space
            const case4 = getRepetitions(uniformRectLarge, nonUniformRectSmall);
            expect(case4).toEqual({ horizontal: 9, vertical: 9 });
        });

        it("should provide accurate dimensions for multiple types", async () => {
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
            (await $(Square.square!)).waitUntil(async function () {
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
    });

    describe("component", () => {
        it("should create a container element from a component", async () => {
            const container = new ContainerComponent("0");

            container.appendToDOM(document.getElementById("test-root")!);

            await expect(
                await $(`.${tickerStyles.container}`)
            ).toHaveElementClassContaining(`${tickerStyles.container}`);
        });

        it("should create an item element from a component", async () => {
            const item = new ItemComponent("0", {
                id: "0",
                lifetime: 0,
                status: "STARTED",
                position: { x: 0, y: 0 },
            });

            item.appendToDOM(document.getElementById("test-root")!);

            await expect(
                await $(`.${itemStyles.item}`)
            ).toHaveElementClassContaining(`${itemStyles.item}`);
        });

        it("should remove child inside a nested component", async () => {
            const container = new ContainerComponent("0");
            const item = new ItemComponent("0", {
                id: "0",
                lifetime: 0,
                status: "STARTED",
                position: { x: 0, y: 0 },
            });

            container.append(item);
            container.appendToDOM(document.getElementById("test-root")!);

            await expect(await $(`.${tickerStyles.container}`)).toHaveChildren(
                1
            );

            container.removeChild(item);

            await expect(
                await $(`.${tickerStyles.container}`)
            ).not.toHaveChildren();
        });

        it("should clone from a template", async () => {
            const template = new TemplateComponent(Square.square!);

            const initialLength = await $$(`.square`).length;

            const clone1 = template.cloneDOM();
            const clone2 = template.cloneDOM();

            document.getElementById("test-root")?.append(...clone1, ...clone2);

            expect(await $$(`.square`).length).toEqual(initialLength + 2);
        });

        it("should update its size given new data", async () => {
            const ticker = new ContainerComponent("0");

            ticker.setSize({ width: 999, height: 999 });

            ticker.appendToDOM(document.getElementById("test-root")!);

            expect(
                await $(`.${tickerStyles.container}`).getSize("width")
            ).toEqual(999);
            expect(
                await $(`.${tickerStyles.container}`).getSize("height")
            ).toEqual(999);

            ticker.setSize({ width: 100, height: 100 });

            expect(
                await $(`.${tickerStyles.container}`).getSize("width")
            ).toEqual(100);
            expect(
                await $(`.${tickerStyles.container}`).getSize("height")
            ).toEqual(100);
        });
    });

    describe("world", () => {
        it("should attach a ticker to the page", async () => {
            const world = new TickerWorld(
                document.getElementById("test-root")!
            );

            const ticker = world.attachTicker("123");

            world.attachToRootHTML(ticker);

            await expect(await $(`.${tickerStyles.container}`)).toExist();
        });

        it("should attach an item to the page", async () => {
            const world = new TickerWorld(
                document.getElementById("test-root")!
            );

            const item = world.attachItem(
                new ContainerComponent("0"),
                new Item()
            );

            world.attachToRootHTML(item);

            await expect(await $(`.${itemStyles.item}`)).toExist();
        });

        it("should remove old ticker items from the page given new data", async () => {
            const container = new Container<Item>();
            const item1 = new Item();
            container.add(item1);

            // construct the world
            const world = new TickerWorld(
                document.getElementById("test-root")!
            );
            const ticker = new ContainerComponent("0");
            const component = world.attachItem(ticker, item1);
            world.attachToRootHTML(component);
            await expect(await $(`.${itemStyles.item}`)).toExist();

            // remove the item and check if it actually got removed
            container.delete(item1);
            world.removeOldItems(container);
            await expect(await $(`.${itemStyles.item}`)).not.toExist();
        });
    });

    // describe("ticker", () => {
    // });
});
