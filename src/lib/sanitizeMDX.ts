export const sanitizeMDX = (code: string, link: string) => {
	const codeSplit = code.split(/(?=```)/);
	let result = '';
	for (const part of codeSplit) {
		if (part.match(/^```\w/)) {
			result += part;
			continue;
		}
		result += part.replaceAll(/(import|export) .+\n/g, '')
			.replaceAll(/<[A-Z][^>]*\/?>/g, `[Component is not available in RSS, visit the the site to access it.](${link})`)
			.replaceAll(/!\[([^\]]+)\]\([^\)]+\)/g, `[“$1” (image is not available in RSS, visit the the site to access it.)](${link})`)
			.replaceAll(/<\/[A-Z][^>]*>/g, '');
	}
	return result;
};
