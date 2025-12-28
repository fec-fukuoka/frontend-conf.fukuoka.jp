import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// スピーカーコレクション
const speakers = defineCollection({
  loader: glob({ pattern: "**/speakers/**/*.md", base: "./src/content" }),
  schema: z.object({
    name: z.string(),
    nameEn: z.string().optional(),
    image: z.string().optional(),
    sessionTitle: z.string(),
    sessionCategory: z.enum([
      "CSS",
      "Accessibility",
      "Performance",
      "ECMAScript/Web API",
      "Server-side JS",
      "Privacy&Security",
      "FE Ecosystem/Tooling",
      "Testing",
      "Design Engineering",
      "Architecture",
      "Browsers",
      "Web Standards",
    ]),
    language: z.enum(["ja", "en"]),
    track: z.enum(["track-a", "track-b", "track-c", "sponsor", "N/A"]),
    startTime: z.string(), // "10:00"
    endTime: z.string(), // "10:30"
    bio: z.string().max(300),
    twitter: z.string().optional(),
    github: z.string().optional(),
    website: z.string().url().optional(),
    locale: z.enum(["ja", "en"]),
    year: z.number(),
    draft: z.boolean().default(false),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/news/**/*.md", base: "./src/content" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    locale: z.enum(["ja", "en"]),
    year: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { speakers, news };
