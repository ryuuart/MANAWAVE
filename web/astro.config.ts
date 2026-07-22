import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    site: "https://manawave.art",
    // Tailwind dresses the art site only; the docs keep Starlight's own styling
    vite: { plugins: [tailwindcss()] },
    integrations: [
        starlight({
            title: "MANAWAVE DOCS",
            favicon: "/favicon-32x32.png",
            social: [
                {
                    icon: "github",
                    label: "GitHub",
                    href: "https://github.com/ryuuart/manawave",
                },
            ],
            head: [
                {
                    tag: "link",
                    attrs: {
                        rel: "icon",
                        href: "/favicon.ico",
                        sizes: "32x32",
                    },
                },
            ],
            // the site root is the art homepage, so the docs send their title
            // to the docs landing page instead
            routeMiddleware: "./src/routeData.ts",
            sidebar: [
                { label: "Home", link: "/" },
                {
                    label: "Start Here",
                    items: [{ autogenerate: { directory: "docs/quickstart" } }],
                },
                {
                    label: "Guides",
                    items: [{ autogenerate: { directory: "docs/guides" } }],
                },
                {
                    label: "Reference",
                    items: [{ autogenerate: { directory: "docs/reference" } }],
                },
            ],
        }),
    ],
});
