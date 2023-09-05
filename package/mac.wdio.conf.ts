import type { Options } from "@wdio/types";
import { config as sharedConfig } from "./shared.wdio.conf.js";

export const config: Options.Testrunner = {
    ...sharedConfig,
    capabilities: [
        {
            maxInstances: 1,
            browserName: "safari technology preview",
            platformName: "macos",
        },
    ],
};
