import { readFile, writeFile } from "fs/promises";
import { resolve } from "path/posix";

// These will be the default values; if I'll need, I'll add more consts
// and data fields to adjust them.
export const MAIN_CAMERA = 'om-3';
export const MAIN_LENS = '45mm';

export const CAMERAS = {
	'e-m5': 'Olympus OM-D E-M5',
	'om-3': 'OM System OM-3',
}

export const LENSES = {
	'75mm': 'Olympus M.Zuiko Digital ED 75mm f/1.8',
	'45mm': 'Olympus M.Zuiko Digital 45mm f/1.8',
	'25mm': 'Olympus M.Zuiko Digital 25mm f/1.8',
	'17mm': 'OM System M.Zuiko Digital 17mm f/1.8 II',
}

import exampleJSON from '@content/photos/_cache/737699511545145683.json';
type CachedData = typeof exampleJSON;

export type DataWithPost = CachedData & { group: PixelfedGroup, photos: CachedData['photos'][number] & { post: CachedData }[] };


// Having the URL here instead of just the ID allows to easily go and see
// which post it is right from the editor.
/** A single Pixelfed post. */
export interface PixelfedPost {
	// Could it be optional? Like, if I know that I'll post something,
	// and want to draft a post about it, but do not have an id yet.
	url: string;
	id?: string;
	data?: DataWithPost;
	group?: PixelfedGroup;

	name?: never;
	photos?: never;
	date?: never;
	camera?: never;
	lens?: never;
}

/** A group of connected Pixelfed posts */
interface PixelfedGroup {
	name: string;
	id?: string;
	date?: string;
	camera?: keyof typeof CAMERAS;
	lens?: keyof typeof LENSES;
	photos: PixelfedPost[];

	url?: never;
}

export type PhotoData = (PixelfedPost|PixelfedGroup)[];


const ACCESS_TOKEN = import.meta.env.PIXEY_TOKEN;
const getStatusInfo = async (id: string) => {
	if (!ACCESS_TOKEN) {
		return;
	}
	const response = await fetch(`https://pixey.org/api/v1/statuses/${id}`, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${ACCESS_TOKEN}`,
		},
	}).catch(() => undefined);
	if (!response) {
		return;
	}

	const data = await response.json();
	const partialData = {
		url: data.url,
		content: data.content,
		created_at: data.created_at,
		reblogs_count: data.reblogs_count,
		favourites_count: data.favourites_count,
		edited_at: data.edited_at,
		replies_count: data.replies_count,
		photos: data.media_attachments.map((d: any) => ({
			url: d.url,
			preview_url: d.preview_url,
			width: d.meta.original.width,
			height: d.meta.original.height,
			alt: d.description
		})),
	};
	return partialData;
};
const __dirname = `${process.cwd()}/src/content/photos`;
const expandPost = async (post: PixelfedPost, group: PixelfedGroup | undefined) => {
	const id = post.url.match(/\/(\d+)$/)?.[1];
	if (!id) {
		return {
			group,
			...post,
		};
	}
	const dataPath = resolve(__dirname, '_cache', `${id}.json`);
	let data: any = await readFile(dataPath, 'utf8').catch(() => undefined);
	if (data) {
		data = JSON.parse(data);
	} else {
		data = await getStatusInfo(id);
		if (!data) {
			return post;
		}
		await writeFile(dataPath, JSON.stringify(data, null, 4));
	}

	data.photos = data.photos?.map((photo: any) => ({
		...photo,
		post: data,
		group,
	}));

	return {
		...post,
		group,
		data: data as DataWithPost,
	};
};
export const expandPhotoData = async (rawData: PhotoData) => {
	return await Promise.all(rawData.map(async (d) => {
		const group = d.name ? d : undefined;
		if (!d.photos) {
			return {
				...(await expandPost(d, group)),
			};
		}
		return {
			...d,
			group,
			photos: await Promise.all(d.photos.map(p => expandPost(p, group))) };
	}));
};
