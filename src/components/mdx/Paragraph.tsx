import type { MDXTagProps } from './types'

export const Paragraph = ({
	children,
	className,
	...props
}: MDXTagProps<HTMLParagraphElement>) => {
	const content = children.props.value.toString().trim();
	const startsWithTag = content[0] === '<'
	const classNames = [];
	if (className) {
		classNames.push(className);
	}
	if (startsWithTag) {
		classNames.push('starts-with-tag');
	}

	return (
		<p
			{...props}
			className={classNames.length ? classNames.join(' ') : undefined }
		>
			{children}
		</p>
	);
};
