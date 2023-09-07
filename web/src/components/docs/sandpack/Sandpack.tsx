import { useEffect, useState } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { SandpackLogLevel } from "@codesandbox/sandpack-client";
import type { SandpackThemeProp } from "@codesandbox/sandpack-react";

import defaultHTML from "./src/index.html?raw";
import defaultJS from "./src/index?raw";
import defaultCSS from "./src/styles.css?raw";
import manawaveRaw from "../../../../node_modules/manawave/dist/manawave.js?raw";

interface Props {
  js?: string;
  html?: string;
  css?: string;
  activeFile?: string;
}

export default ({ js: code, html, css, activeFile }: Props) => {
  const [theme, setTheme] = useState<SandpackThemeProp>("auto");

  useEffect(() => {
    const documentData = window.document.documentElement.dataset;

    setTheme(documentData.theme as SandpackThemeProp);

    const mutationObserver = new MutationObserver(
      (mutations: MutationRecord[]) => {
        for (const mutation of mutations) {
          if (mutation.type === "attributes") {
            if (documentData.theme === "light") setTheme("light");
            else if (documentData.theme === "dark") setTheme("dark");
            else setTheme("auto");
          }
        }
      }
    );
    mutationObserver.observe(window.document.documentElement, {
      attributeFilter: ["data-theme"],
    });
    return () => {
      mutationObserver.disconnect();
    };
  }, [theme]);

  return (
    <Sandpack
      template="vanilla"
      customSetup={{
        entry: "index.html",
        devDependencies: {
          "@babel/core": "^7.2.0",
        },
        dependencies: {
          manawave: "^0.11.2",
        },
      }}
      files={{
        "node_modules/manawave/package.json": {
          code: JSON.stringify({
            name: "manawave",
            main: "./index.js",
            type: "module",
          }),
          hidden: true,
        },
        "node_modules/manawave/index.js": {
          code: manawaveRaw,
          hidden: true,
        },
        "/sandbox.config.json": {
          code: JSON.stringify({
            infiniteLoopProtection: false,
          }),
          hidden: true,
        },
        "/index.html": { code: html ?? defaultHTML },
        "/styles.css": { code: css ?? defaultCSS },
        "/index.js": {
          code: code ?? defaultJS,
        },
      }}
      options={{
        //@ts-ignore
        activeFile: activeFile ?? "/index.js",
        logLevel: SandpackLogLevel.None,
        showConsoleButton: true,
      }}
      theme={theme}
    />
  );
};
