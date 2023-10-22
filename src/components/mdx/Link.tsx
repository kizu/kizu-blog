
export const Link = ({ children, ...props }) => {
	// If the text content of the link starts and ends with the quotes,
	// wrap the contens with a `<u>` to enable a better link display.
	const modifiedContent =
		children.props.value.toString().replace(/^“(.+)”$/, '“<u>$1</u>”');
	return (
		<a
			{...props}
			dangerouslySetInnerHTML={{__html: modifiedContent}}
		/>);
};
