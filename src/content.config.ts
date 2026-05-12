// 1. Import utilities from `astro:content`
import {defineCollection} from 'astro:content';
import {z} from 'astro/zod';
import {glob} from "astro/loaders";

const projectsCollection = defineCollection({
    loader: glob({pattern: '**/*.md', base: './src/content/projects/'}),
    schema: z.object({
        title: z.string(),
        tags: z.array(z.string()),
        image: z.string().optional(),
        description: z.string(),
        description_cs: z.string().optional(),
        featured: z.boolean().optional(),
        links: z.array(z.object({
            title: z.string(),
            url: z.string(),
            icon: z.string()
        }))
    }),
});

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
    'projects': projectsCollection,
};