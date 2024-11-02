import { getCategorized } from "@lib/getCategorized";
import { getMusicTag } from "@lib/getMusicTag";

export const getAllMusic = async () => getCategorized(
	(post, addPost) => {
		const musicTag = getMusicTag(post.data.current?.music)?.[0];
		if (musicTag) {
			addPost(musicTag, post);
		}
	}
);
