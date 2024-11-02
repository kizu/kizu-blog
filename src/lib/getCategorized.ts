import { getSortedPosts } from '@lib/getSortedPosts';

type Post = (Awaited<ReturnType<typeof getSortedPosts>>)[number];

export const getCategorized = async (handlePost: (post: Post, addPost: (tag: string, post: Post) => void) => void) => {
	const posts = await getSortedPosts();
	const categoryMap = new Map<string, Post[]>();

	const addPost = (tag: string, post: Post) => {
		const tagPosts = categoryMap.get(tag) || [];
		if (!tagPosts.length) {
			categoryMap.set(tag, tagPosts);
		}
		tagPosts.push(post);
	}
	posts.map((post) => handlePost(post, addPost));
	return categoryMap;
}
