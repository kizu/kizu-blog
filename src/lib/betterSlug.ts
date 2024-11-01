export const betterSlug =
	(slug: string) => {
		const result = slug
			// Do not include folders that are only numbers.
			.replace(/^(\d+\/)+/, '')
			// When a page is nested into a named folder, do not output duplicate name.
			.replace(/^([^\/]+)\/\1/, '$1')
			// If the name starts from a two-digit number: remove it.
			.replace(/^\d\d-/, '');
		return result;
	}
