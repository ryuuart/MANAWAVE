import { useEffect, useState } from "react";
import { Sandpack, SandpackThemeProp } from "@codesandbox/sandpack-react";

import defaultHTML from "./src/index.html?raw";
import defaultJS from "./src/js/index?raw";
import css from "./src/styles/style.css?raw";

interface Props {
  code?: string;
  html?: string;
}

export default ({ code, html }: Props) => {
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
      customSetup={{
        environment: "parcel",
        devDependencies: {
          "@babel/core": "7.2.0",
        },
        dependencies: {
          manawave: "^0.11.0",
        },
        entry: "index.html",
      }}
      files={{
        "/index.html": { code: html ?? defaultHTML },
        "/styles/style.css": { code: css, hidden: true },
        "/js/index.js": {
          code: code ?? defaultJS,
          active: true,
        },
      }}
      theme={theme}
    />
  );
};
