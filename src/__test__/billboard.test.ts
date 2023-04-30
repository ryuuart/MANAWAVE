import Basic from "@test/pages/basic/Basic";
import BillboardManager from "../BillboardManager";
import Billboard from "~src/Billboard";

describe("billboard", () => {
    afterEach(() => {
        Basic.clearContent();
    });

    it("should be able to initialize css", async () => {
        Basic.loadContent();

        BillboardManager.loadCSS();
        BillboardManager.unloadCSS();
        BillboardManager.loadCSS();

        expect(document.contains(BillboardManager.styleElement)).toBeTruthy();
    });

    it("should be able to remove initialized css", async () => {
        Basic.loadContent();

        BillboardManager.loadCSS();
        BillboardManager.unloadCSS();

        expect(document.contains(BillboardManager.styleElement)).toBeFalsy();
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
        expect(
            document.head.contains(BillboardManager.styleElement)
        ).toBeFalsy();
        expect(BillboardManager.hasBillboards).toBeFalsy();
    });
});
