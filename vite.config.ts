import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    build: {
        target: "esnext",
    },
    plugins: [tsconfigPaths()],
});
