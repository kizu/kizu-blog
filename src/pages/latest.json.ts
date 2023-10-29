import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { betterSlug } from '@lib/betterSlug';

interface Item {
	url: string;
}
export async function get(context: APIContext) {
	const posts = await getCollection('blog');
	const items: Item[] = [];
	for (const post of posts) {
		const url = `${context.site}${betterSlug(post.slug)}/`;
		items.push({
			...post.data,
			url,
		});
		if (items.length === 5) {
			break;
		}
	}
	return {
		body: JSON.stringify(items),
		// body: JSON.stringify(items, null, 2),
	};
}
