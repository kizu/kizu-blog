import type { ComponentChildren, JSX } from 'preact';

// See https://github.com/withastro/astro/blob/main/packages/integrations/preact/src/static-html.ts
// When passing children to preact, Astro does this by passing them as a string inside a wrapper element. I did not find it exported, so have to redefine the interface of what I'm using to render them.
interface AstroPreactChildren {
	props: {
		value: {
			toString: () => string;
		}
	}
}

interface LinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
	children: AstroPreactChildren;
}

export const Link = ({ children, className, ...props }: LinkProps) => {
	const classNames = [];
	if (className) {
		classNames.push(className);
	}
	// If the text content of the link starts and ends with the quotes,
	// wrap the contens with a `<u>` to enable a better link display.
	const modifiedContent =
		children.props.value.toString().replace(/^([“‘]?)(.+?)([”’]?)$/, (m, p1, p2, p3) => {
			if (!p1 && !p2) {
				return m;
			}
			if (p1) {
				classNames.push('has-left-overhang')
			}
			if (p2) {
				classNames.push('has-right-overhang')
			}
			return `${p1}<u>${p2}</u>${p3}`;
		});
	return (
		<a
			{...props}
			{...(classNames.length ? { class: classNames.join(' ') } : {})}
			dangerouslySetInnerHTML={{__html: modifiedContent}}
		/>);
};
