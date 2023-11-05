import type { ComponentChildren } from 'preact';

interface LinkProps {
	children: ComponentChildren;
}

export const Link = ({ children, ...props }: LinkProps) => {
	// If the text content of the link starts and ends with the quotes,
	// wrap the contens with a `<u>` to enable a better link display.
	const modifiedContent =
		// Need to explore a better way to do it.
		// @ts-expect-error
		children.props.value.toString().replace(/^([“‘])(.+)([”’])$/, '$1<u>$2</u>$3');
	return (
		<a
			{...props}
			dangerouslySetInnerHTML={{__html: modifiedContent}}
		/>);
};
