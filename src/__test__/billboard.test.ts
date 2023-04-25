import Basic from "@test/pages/basic/Basic";
import { billboardManager } from "~src";
import Billboard from "~src/Billboard";

describe("billboard", () => {
    afterEach(() => {
        Basic.clearContent();
    });

    it("should be able to initialize css", async () => {
        Basic.loadContent();

        billboardManager.loadCSS();
        billboardManager.unloadCSS();
        billboardManager.loadCSS();

        expect(document.contains(billboardManager.styleElement)).toBeTruthy();
    });

    it("should be able to remove initialized css", async () => {
        Basic.loadContent();

        billboardManager.loadCSS();
        billboardManager.unloadCSS();

        expect(document.contains(billboardManager.styleElement)).toBeFalsy();
    });
});
