import { Sandpack } from "@codesandbox/sandpack-react";
import html from "./src/index.html?raw";
import css from "./src/styles/style.css?raw";
import js from "./src/js/index?raw";

export default () => {
  return (
    <Sandpack
      className="not-content"
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
        "/index.html": { code: html },
        "/styles/style.css": { code: css, hidden: true },
        "/js/index.js": {
          code: js,
          active: true,
        },
      }}
      theme="auto"
    />
  );
};
