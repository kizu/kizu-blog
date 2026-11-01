import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({
		pattern: '**/*.{md,mdx}',
		base: './src/content/blog',
	}),

	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		fancyTitle: z.union(
			[
				z.string().optional(),
				z.boolean().optional(),
			],
		),
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
		bandcamp: z.object({
			track: z.string().optional(),
			link: z.string(),
		}).optional(),
		tags: z.array(z.string()),
	}),
});

export const collections = { blog };
