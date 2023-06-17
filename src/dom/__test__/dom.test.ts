import Square from "test/pages/square/Square";
import { getRepetitions, measure } from "../measure";
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

describe("dom", () => {
    beforeEach(() => {
        Square.loadContent();
    });
    afterEach(() => {
        Square.clearContent();
    });

    it("should measure a dom element if rendered", async () => {
        const testElement = Square.square!;
        testElement.style.width = "120px";
        testElement.style.height = "130px";

        // our change in measurement should be observed
        const rect = measure(testElement);

        const observedElement = await $(`#${testElement.id}`);
        const observedRect = await observedElement.getSize();

        expect(rect?.width).toEqual(120);
        expect(rect?.height).toEqual(130);

        expect(rect?.width).toEqual(observedRect.width);
        expect(rect?.height).toEqual(observedRect.height);

        // if the element is removed or disconnected from the page,
        // there is no returned measurement
        testElement.remove();

        let disconnectedRect = measure(testElement);

        expect(disconnectedRect).toBe(null);
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

            expect(
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

            expect(await $(`.${itemStyles.item}`)).toHaveElementClassContaining(
                `${itemStyles.item}`
            );
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

            expect(`.${tickerStyles.container}`).toHaveChildren(1);

            container.removeChild(item);

            expect(`.${tickerStyles.container}`).not.toHaveChildren();
        });

        it("should clone from a template", async () => {
            const template = new TemplateComponent(Square.square!);

            const clone1 = template.cloneDOM();
            const clone2 = template.cloneDOM();

            document.getElementById("test-root")?.append(...clone1, ...clone2);

            expect(await $$(`.square`).length).toEqual(3);
        });
    });
});
