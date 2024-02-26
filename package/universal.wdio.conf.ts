import type { Options } from "@wdio/types";
import { config as sharedConfig } from "./shared.wdio.conf.js";
import { platform } from "os";

const capabilities: WebdriverIO.Capabilities[] = [
    {
        // maxInstances can get overwritten per capability. So if you have an in-house Selenium
        // grid with only 5 firefox instances available you can make sure that not more than
        // 5 instances get started at a time.
        "wdio:maxInstances": 3,
        //
        browserName: "chrome",
        browserVersion: "116",
        // If outputDir is provided WebdriverIO can capture driver session logs
        // it is possible to configure which logTypes to include/exclude.
        // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
        // excludeDriverLogs: ['bugreport', 'server'],
    },
    {
        "wdio:maxInstances": 3,
        browserName: "firefox",
    },
];

if (platform() === "darwin") {
    const macOSCapability: WebdriverIO.Capabilities = {
        "wdio:maxInstances": 1,
        browserName: "safari technology preview",
    };

    capabilities.push(macOSCapability);
}

export const config: Options.Testrunner = {
    ...sharedConfig,
    capabilities,
};
