import type { MDXTagProps } from './types'

export const Link = ({
	children,
	className,
	...props
}: MDXTagProps<HTMLAnchorElement>) => {
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
			class={classNames.length ? classNames.join(' ') : undefined }
			dangerouslySetInnerHTML={{ __html: modifiedContent }}
		/>);
};
