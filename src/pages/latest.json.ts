import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { betterSlug } from '@lib/betterSlug';

interface Item {
	url: string;
}
export async function GET(context: APIContext) {
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);
	const items: Item[] = [];
	for (const post of posts) {
		// Do not use weekly or non-CSS/HTML posts for the latest.
		if (
			post.data.tags.includes('bookmarks') ||
			!post.data.tags.some(tag => ['CSS', 'HTML'].includes(tag))
		) {
			continue;
		}
		const url = `${context.site}${betterSlug(post.slug)}/`;
		items.push({
			...post.data,
			url,
		});
		if (items.length === 5) {
			break;
		}
	}
	return Response.json({
		body: JSON.stringify(items),
		// body: JSON.stringify(items, null, 2),
	});
}
