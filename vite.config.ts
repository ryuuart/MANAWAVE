import { resolve } from "path";
import { defineConfig } from "vite";
import { dirname } from "path";
import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";

const _dirname =
    typeof __dirname !== "undefined"
        ? __dirname
        : dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [tsconfigPaths()],
    build: {
        lib: {
            entry: resolve(_dirname, "src/index.ts"),
            name: "Ouroboros",
            fileName: "ouroboros",
        },
        rollupOptions: {
            input: {
                // main: resolve(_dirname, "index.html"),
                example: resolve(_dirname, "example/index.html"),
            },
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            // external: ['vue'],
            // output: {
            //   // Provide global variables to use in the UMD build
            //   // for externalized deps
            //   globals: {
            //     vue: 'Vue',
            //   },
            // },
        },
    },
});
