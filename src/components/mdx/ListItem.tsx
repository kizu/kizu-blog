import type { MDXTagProps } from './types'

export const ListItem = ({
	children,
	className,
	...props
}: MDXTagProps<HTMLLIElement>) => {
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
		<li
			{...props}
			className={classNames.length ? classNames.join(' ') : undefined }
		>
			{children}
		</li>
	);
};
