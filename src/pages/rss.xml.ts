import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function get(context: APIContext) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: String(context.site),
		xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `
			<language>en</language>
			<atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />
		`,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.slug}/`,
		})),
	});
}
