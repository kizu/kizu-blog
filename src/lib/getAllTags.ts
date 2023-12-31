import { getSortedPosts } from '@lib/getSortedPosts';
export const getAllTags = async () => {
	const posts = await getSortedPosts();

	const tagsMap = new Map();

	for (const post of posts) {
		for (const tag of post.data.tags) {
			const tagPosts = tagsMap.get(tag) || [];
			if (!tagPosts.length) {
				tagsMap.set(tag, tagPosts);
			}
			tagPosts.push(post);
		}
	}

	return tagsMap;
}
