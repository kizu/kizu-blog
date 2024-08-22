import type { APIContext } from 'astro';
import type { RSSOptions } from '@astrojs/rss';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '@consts';
import { betterSlug } from '@lib/betterSlug';
import { markdown } from '@lib/markdown'
import { getMastodonPostLink } from '@lib/getMastodonPostLink';

export async function GET(context: APIContext) {
	const posts = await getCollection('blog');
	const items: RSSOptions['items'] = [];
	for (const post of posts) {
		const link = `/${betterSlug(post.slug)}/`;
		const fullLink = `${context.site}${betterSlug(post.slug)}/`;
		const { mastodonPostId, current } = post.data;
		const text = `${post.body}\n- - -\nLet me know what you think about this [on Mastodon](${getMastodonPostLink(mastodonPostId)})!`;
		// Could be improved in the future, see
		// > Possibly unblock .mdx compiledContent/html output
		// https://github.com/withastro/roadmap/issues/533
		let content = (await markdown(text, fullLink)).toString().replaceAll(/(<pre[^>]+><code)/g, '$1 style="tab-size: 2;"');
		if (current) {
			content = `<dl>${Object.entries(current).map(([key, value]) => (`<dt>Current ${key}:</dt><dd>${value}</dd>`)).join('')}</dl><hr />${content}`
		}
		items.push({
			...post.data,
			link,
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
