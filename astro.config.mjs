// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkToC from 'remark-toc';
import { Features } from 'lightningcss';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.kizu.dev',
	markdown: {
		processor: unified({
			remarkPlugins: [ [remarkToC, {
				heading: "table of contents",
			} ] ]
		}),
		// Done manually using Astro's Code component and some overrides
		syntaxHighlight: false,
	},
	integrations: [mdx(), sitemap()],
	redirects: {
		'/weekly-boolmarks-013': '/weekly-bookmarks-013',
		'/tags/weekly': '/tags/bookmarks'
	},
	vite: {
		css: {
			transformer: "lightningcss",
			lightningcss: {
				targets: {},
				include: Features.Nesting,
			},
		},
		logLevel: 'error',
	},
});
