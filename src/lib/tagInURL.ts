export const tagInURL =
	(tag: string) =>
		tag
			// Remove any whitespace
			.replaceAll(/\s+/g, '-')
			// Only use lowercase
			.toLowerCase()
