import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
    docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),

    realms: defineCollection({
        // underscore-prefixed files are drafts and stay out of the collection
        loader: glob({ base: "./src/content/realms", pattern: "**/[^_]*.md" }),
        schema: z.object({
            title: z.string(),
            tagline: z.string(),
            author: reference("authors"),
            song: z.object({
                name: z.string(),
                link: z.url(),
            }),
            color: z.object({
                portal: z.string(),
            }),
        }),
    }),

    authors: defineCollection({
        loader: glob({ base: "./src/content/authors", pattern: "**/*.json" }),
        schema: z.object({
            name: z.string(),
            link: z.url(),
        }),
    }),
};
