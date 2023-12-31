import { sanitizeMDX } from '@lib/sanitizeMDX';
import { markdown as md } from '@astropub/md'

export const markdown = async (text: string, link: string) =>
  md(sanitizeMDX(text, link));
