import { MW } from "manawave";
import Basic from "test/pages/basic/Basic";

describe("dom", () => {
    before(async () => {
        await browser.setWindowSize(1200, 945);
    });

    afterEach(() => {
        document.getElementById("test-root")?.replaceChildren();
    });

    describe("integration", () => {
        afterEach(() => {
            Basic.clearContent();
        });

        it("should customize the direction actively", async () => {
            Basic.loadContent();

            const mw = new MW(Basic.ticker!, { direction: "345" });

            for (let i = 0; i <= 360; i++) {
                mw.direction = i;

                expect(mw.direction).toEqual(i);
            }
        });
    });
});
