import type { JSX } from 'preact';

// See https://github.com/withastro/astro/blob/main/packages/integrations/preact/src/static-html.ts
// When passing children to preact, Astro does this by passing them as a string inside a wrapper element. I did not find it exported, so have to redefine the interface of what I'm using to render them.
interface AstroPreactChildren {
	props: {
		value: {
			toString: () => string;
		}
	}
}

export interface MDXTagProps<T extends HTMLElement> extends JSX.HTMLAttributes<T> {
	children: AstroPreactChildren;
}
