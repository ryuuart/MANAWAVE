// src/content/config.ts
import { defineCollection, reference, z } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
    docs: defineCollection({ schema: docsSchema() }),
    realms: defineCollection({
        type: "content",
        schema: z.object({
            title: z.string(),
            tagline: z.string(),
            author: reference("authors"),
            song: z.object({
                name: z.string(),
                link: z.string(),
            }),
            color: z.object({
                portal: z.string(),
            }),
        }),
    }),
    authors: defineCollection({
        type: "data",
        schema: z.object({
            name: z.string(),
            link: z.string(),
        }),
    }),
};
