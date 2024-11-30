
import { type PhotoData } from '@lib/expandPhotoData';
import { expandPhotoData } from '@lib/expandPhotoData';

export const rawPhotoData: PhotoData = [
	{
		name: 'A walk to the Seine and back',
		date: '2024-09-05',
		photos: [
			{ url: 'https://pixey.org/i/web/post/737699511545145683' },
			{ url: 'https://pixey.org/i/web/post/738019959485173727' },
			{ url: 'https://pixey.org/i/web/post/739971733249250140' },
			{ url: 'https://pixey.org/i/web/post/740944759087514268' },
			{ url: 'https://pixey.org/i/web/post/742711249111700023' },
			{ url: 'https://pixey.org/i/web/post/743090656662981352' },
		],
	},
];

export const photoData = await expandPhotoData(rawPhotoData);
