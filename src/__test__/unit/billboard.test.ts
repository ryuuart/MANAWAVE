import Basic from "test/pages/basic/Basic";
import BillboardManager from "src/BillboardManager";
import { Billboard } from "src/";

describe("billboard", () => {
    afterEach(() => {
        Basic.clearContent();
    });

    // I essentiallly observe and compare transformations and states before then after
    // Other tests will validate if it properly tears down
    it("should return website to original state when deinitializing billboard", async () => {
        Basic.loadContent();

        const before = Basic.ticker.children;
        const beforeClass = Array.from(Basic.ticker.classList);
        const billboard = new Billboard(Basic.ticker);

        billboard.init();

        expect(beforeClass).not.toStrictEqual(
            Array.from(Basic.ticker.classList)
        );

        billboard.deinit();

        const after = Basic.ticker.children;
        const afterClass = Array.from(Basic.ticker.classList);

        expect(beforeClass).toStrictEqual(afterClass);
        expect(before).toEqual(after);
        expect(BillboardManager.hasBillboards).toBeFalsy();
    });

    describe("billboard lifecycle", () => {
        it("should set and use lifecycle hooks", async () => {
            Basic.loadContent();
            const content = async () => await $$(`#${Basic.ticker.id} .square`);

            for (const e of await content()) {
                expect(await e.getHTML(false)).not.toEqual("CREATED");
            }

            const bb = new Billboard(Basic.ticker, { autoplay: false });

            let elementCounter = 0;
            bb.onItemCreated((element: HTMLElement) => {
                elementCounter++;
                element.textContent = "CREATED";
            });

            const destroyedElements: Element[] = [];
            bb.onItemDestroyed((element: HTMLElement) => {
                destroyedElements.push(element);
            });

            bb.init();

            for (const e of await content()) {
                // test init
                expect(await e.getHTML(false)).toEqual("CREATED");

                // make sure it's green, no side-effects
                await expect(e).toHaveStyle({
                    backgroundColor: "rgba(0,128,0,1)",
                });
            }

            bb.each((element: HTMLElement) => {
                element.style.backgroundColor = "red";
            });

            for (const e of await content()) {
                await expect(e).toHaveStyle({
                    backgroundColor: "rgba(255,0,0,1)",
                });
            }

            bb.deinit();

            expect(destroyedElements.length).toEqual(elementCounter);
        });
    });
});
