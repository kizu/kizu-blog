
import { type PhotoData } from '@lib/expandPhotoData';
import { expandPhotoData } from '@lib/expandPhotoData';

export const rawPhotoData: PhotoData = [
	{
		name: 'A walk to the Seine and back',
		date: '2024-09-05',
		camera: 'e-m5',
		photos: [
			{ url: 'https://pixey.org/i/web/post/737699511545145683' },
			{ url: 'https://pixey.org/i/web/post/738019959485173727' },
			{ url: 'https://pixey.org/i/web/post/739971733249250140' },
			{ url: 'https://pixey.org/i/web/post/740944759087514268' },
			{ url: 'https://pixey.org/i/web/post/742711249111700023' },
			{ url: 'https://pixey.org/i/web/post/743090656662981352' },
		],
	},
	{
		name: 'A walk on December 25, 2024',
		date: '2024-12-25',
		camera: 'e-m5',
		lens: '25mm',
		photos: [
			{ url: 'https://pixey.org/i/web/post/785237288622073118' },
		],
	},
	{
		name: 'A walk on March 16, 2025',
		date: '2025-03-16',
		camera: 'om-3',
		lens: '17mm',
		photos: [
			{ url: 'https://pixey.org/i/web/post/809179867247976916' },
			{ url: 'https://pixey.org/i/web/post/809380728694054639' },
			{ url: 'https://pixey.org/i/web/post/809423092779329936' },
			{ url: 'https://pixey.org/i/web/post/809781879435778810' },
			{ url: 'https://pixey.org/i/web/post/810068343678710778' },
			{ url: 'https://pixey.org/i/web/post/810978614686558148' },
			{ url: 'https://pixey.org/i/web/post/811536176799506178' },
			{ url: 'https://pixey.org/i/web/post/811610229114043023' },
			{ url: 'https://pixey.org/i/web/post/812025914731605436' },
			{ url: 'https://pixey.org/i/web/post/812393829869436641' },
			{ url: 'https://pixey.org/i/web/post/812986135263749555' },
			{ url: 'https://pixey.org/i/web/post/813797119357494978' },
			{ url: 'https://pixey.org/i/web/post/813876267816731263' },
			{ url: 'https://pixey.org/i/web/post/814147397504107009' },
			{ url: 'https://pixey.org/i/web/post/814417117161899268' },
		],
	},
];

export const photoData = await expandPhotoData(rawPhotoData);
