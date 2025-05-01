import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		fancyTitle: z.string().optional(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		eventDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		heroImage: z.string().optional(),
		mastodonPostId: z.string().optional(),
		current: z.object({
			mood: z.string().optional(),
			music: z.string().optional(),
			drink: z.string().optional(),
			location: z.string().optional(),
		}).optional(),
		tags: z.array(z.string()),
	}),
});

export const collections = { blog };
