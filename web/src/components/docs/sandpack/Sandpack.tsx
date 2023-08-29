import { Sandpack } from "@codesandbox/sandpack-react";

import defaultHTML from "./src/index.html?raw";
import defaultJS from "./src/js/index?raw";
import css from "./src/styles/style.css?raw";

interface Props {
  code?: String;
  html?: String;
}

export default ({ code, html }: Props) => {
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
      theme="auto"
    />
  );
};
