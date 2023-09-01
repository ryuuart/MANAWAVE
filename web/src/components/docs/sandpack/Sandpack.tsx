import { useEffect, useState } from "react";
import {
  Sandpack,
  SandpackInternalOptions,
  SandpackThemeProp,
} from "@codesandbox/sandpack-react";

import defaultHTML from "./src/index.html?raw";
import defaultJS from "./src/index?raw";
import css from "./src/style.css?raw";

interface Props {
  js?: string;
  html?: string;
  activeFile?: string;
}

export default ({ js: code, html, activeFile }: Props) => {
  const [theme, setTheme] = useState<SandpackThemeProp>(
    (window.document.documentElement.dataset.theme as SandpackThemeProp) ??
      "auto"
  );

  useEffect(() => {
    const documentData = window.document.documentElement.dataset;
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
  }, []);

  return (
    <Sandpack
      template="vite"
      customSetup={{
        dependencies: {
          manawave: "^0.11.1",
        },
        entry: "index.html",
      }}
      files={{
        "/index.html": { code: html ?? defaultHTML },
        "/style.css": { code: css },
        "/index.js": {
          code: code ?? defaultJS,
        },
      }}
      options={{
        //@ts-ignore
        activeFile: activeFile ?? "/index.js",
        showConsoleButton: true,
      }}
      theme={theme}
    />
  );
};
