// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    description: z.string(),
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