import type { APIContext } from 'astro';
import rss, { RSSOptions } from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { betterSlug } from '../lib/betterSlug';
import { markdown } from '@astropub/md'

export async function get(context: APIContext) {
	const posts = await getCollection('blog');
	const items: RSSOptions['items'] = [];
	for (const post of posts) {
		const content = (await markdown(post.body)).toString();
		items.push({
			...post.data,
			link: `/${betterSlug(post.slug)}/`,
			content,
		});
	}
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: String(context.site),
		xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `
			<language>en</language>
			<atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />
		`,
		items,
	});
}
