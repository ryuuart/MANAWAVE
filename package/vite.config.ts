import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import cssInjectedByJs from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";

const root = fileURLToPath(new URL(".", import.meta.url));

const FILE_NAMES: Record<string, string> = {
    es: "manawave.js",
    umd: "manawave.umd.cjs",
    iife: "manawave.min.js",
};

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    build: {
        lib: {
            entry: resolve(root, "src/index.ts"),
            name: "manawave",
            formats: ["es", "umd", "iife"],
            fileName: (format) => FILE_NAMES[format] ?? `manawave.${format}.js`,
        },
    },
    plugins: [
        // manawave ships as a single drop-in file, so its stylesheets ride
        // along inside the bundle rather than as a separate dist/*.css
        ...cssInjectedByJs(),

        {
            ...dts({
                entryRoot: "src",
                include: ["types", "src"],
                exclude: ["example", "test", "**/__test__/**/*"],
                copyDtsFiles: true,

                // manawave.Options, Rect and the hook signatures are ambient
                // globals, so the entry declaration has to pull them in or a
                // consumer only ever sees `any`
                beforeWriteFile(filePath, content) {
                    if (!filePath.endsWith("dist/index.d.ts")) return;

                    return {
                        content: `/// <reference path="./types/env.d.ts" />\n${content}`,
                    };
                },
            }),
            apply: "build",
            enforce: "post",
        },
    ],
});
