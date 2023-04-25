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

    it("should return website to original state when deinitializing billboard", async () => {
        Basic.loadContent();

        const billboard = new Billboard(Basic.ticker);

        billboard.deinit();
        expect(billboard.ticker.ticker.element.children.length).toBe(0);
        expect(
            document.head.contains(BillboardManager.styleElement)
        ).toBeFalsy();
        expect(BillboardManager.hasBillboards).toBeFalsy();
        expect(document.contains(billboard.ticker.ticker.element)).toBeFalsy();
    });
});
