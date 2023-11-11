export const sanitizeMDX = (code: string, link: string) => {
  return code
    .replaceAll(/(import|export) .+\n/g, '')
    .replaceAll(/<[A-Z][^>]*\/?>/g, `[Component is not available in RSS, visit the the site to access it.](${link})`)
    .replaceAll(/!\[([^\]]+)\]\([^\)]+\)/g, `[“$1” (image is not available in RSS, visit the the site to access it.)](${link})`)
    .replaceAll(/<\/[A-Z][^>]*>/g, '');
};
