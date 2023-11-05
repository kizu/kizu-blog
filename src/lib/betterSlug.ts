export const betterSlug =
	(slug: string) =>
		slug
			// Do not include folders that are only numbers.
			.replace(/^(\d+\/)+/, '')
			// When a page is nested into a named folder, do not output duplicate name.
			.replace(/^([^\/]+)\/\1/, '$1');
