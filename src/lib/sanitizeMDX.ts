export const sanitizeMDX = (code: string, link: string) => {
  return code
    .replaceAll(/import .+\n/g, '')
    .replaceAll(/<[A-Z][^>]*\/?>/g, `[Component is not available in RSS, visit the the site to access it.](${link})`)
    .replaceAll(/<\/[A-Z][^>]*>/g, '');
};
