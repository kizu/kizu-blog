import { getCategorized } from "@lib/getCategorized";

export const getAllTags = async () => getCategorized(
	(post, addPost) => post.data.tags.map(tag => addPost(tag, post))
);
