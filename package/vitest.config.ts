import { platform } from "node:process";
import { defineConfig } from "vitest/config";
import { webdriverio } from "@vitest/browser-webdriverio";

/**
 * manawave is a DOM library — every test runs inside a real browser against a
 * real layout engine. There is no jsdom shim and no headless DOM emulation.
 */
const browsers: ("chrome" | "firefox" | "safari")[] = ["chrome", "firefox"];

// Safari has no headless mode and needs a one-time `safaridriver --enable`,
// so it stays opt-in rather than breaking `mise test` out of the box.
if (platform === "darwin" && process.env.MANAWAVE_SAFARI) {
    browsers.push("safari");
}

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        include: ["src/**/*.test.ts"],
        browser: {
            enabled: true,
            headless: true,
            provider: webdriverio(),
            instances: browsers.map((browser) => ({ browser })),
            viewport: { width: 1200, height: 945 },
        },
        coverage: {
            provider: "v8",
            include: ["src/**/*.ts"],
            exclude: ["src/MW.ts", "**/__test__/**"],
        },
    },
});
