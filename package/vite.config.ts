import { resolve } from "path";
import { defineConfig } from "vite";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { copyFileSync } from "fs";
import tsconfigPaths from "vite-tsconfig-paths";

// needed because of https://github.com/vitejs/vite/issues/1579
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// generate declaration files
import dts from "vite-plugin-dts";

const _dirname =
    typeof __dirname !== "undefined"
        ? __dirname
        : dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        lib: {
            entry: resolve(_dirname, "src/index.ts"),
            name: "manawave",
            fileName: "manawave",
        },
    },
    plugins: [
        tsconfigPaths(),
        {
            ...cssInjectedByJsPlugin(),
            apply: "build",
        },
        {
            ...dts({
                entryRoot: "src",
                compilerOptions: {
                    types: ["./types/env.d.ts"],
                },
                include: ["types", "src"],
                exclude: ["example", "test", "**/__test__/**/*"],
                rollupTypes: true,
            }),
            apply: "build",
            enforce: "post",
        },
        {
            ...dts({
                entryRoot: "types",
                copyDtsFiles: true,
                outDir: "dist/types",
                exclude: ["example", "test", "**/__test__/**/*"],
            }),
            apply: "build",
            enforce: "post",
        },
    ],
});
