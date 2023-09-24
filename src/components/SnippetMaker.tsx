import type { JSXInternal } from 'node_modules/preact/src/jsx';
import { useMemo, useState, useEffect } from 'preact/hooks';

type SnippetsMap = Map<HTMLElement, HTMLElement[]>;

/** Find all snippets and associate them with their headers. */
const getSnippets = () => {
	const headersAndSnippets =
		document.querySelectorAll('pre.language-css, h2, h3, h4, h5, h6');
	const snippets: SnippetsMap = new Map();
	let currentHeader: HTMLElement | undefined = undefined;
	for (const node of headersAndSnippets) {
		if (!(node instanceof HTMLElement)) {
			continue;
		}
		if (node.tagName !== 'PRE') {
			currentHeader = node;
			continue;
		}
		if (!currentHeader) {
			continue;
		}
		const subSnippets = snippets.get(currentHeader) || [];
		subSnippets.push(node);
		snippets.set(currentHeader, subSnippets);
	}
	return snippets;
};

const useSnippets = () => {
	const [snippets, setSnippets] = useState<SnippetsMap>(new Map());
	useEffect(() => {
		setSnippets(getSnippets());
	}, []);

	const [selection, setSelection] = useState(new Set<HTMLElement>());
	useEffect(() => {
		if (!snippets.size) {
			return;
		}
		setSelection(new Set(snippets.keys()))
	}, [snippets]);
	const addSelection =
		(item: HTMLElement) =>
			setSelection(prev => new Set(prev.add(item)));
	const removeSelection =
		(item: HTMLElement) =>
			setSelection(prev => {prev.delete(item); return new Set(prev)});
	const fullSelection = () => setSelection(new Set(snippets.keys()));
	const clearSelection = () => setSelection(new Set());
	return {
		snippets,
		selection,
		addSelection,
		removeSelection,
		fullSelection,
		clearSelection,
	};
}

interface TextInputProps extends Omit<JSXInternal.HTMLAttributes<HTMLInputElement>, 'onChange' | 'onInput'> {
	value: string;
	onChange: (value: string) => void;
}

const TextInput = ({ value, onChange, ...props }: TextInputProps) => (
	<input
		type="text"
		{...props}
		value={value}
		onInput={({ target }) => {
			if (!(target instanceof HTMLInputElement)) {
				return;
			}
			onChange(target.value);
		}}
	/>
);

interface CheckBoxProps extends Omit<JSXInternal.HTMLAttributes<HTMLInputElement>, 'onChange' | 'checked' | 'type'>
 {
	isChecked: boolean;
	onChange: (isChecked: boolean) => void;
}

const CheckBox = ({ isChecked, onChange, ...props }: CheckBoxProps) => (
	<input
		{...props}
		type="checkbox"
		checked={isChecked}
		onChange={({ target }) => {
			if (!(target instanceof HTMLInputElement)) {
				return;
			}
			onChange(target.checked);
		}}
	/>
);

export const SnippetMaker = () => {
	const {
		snippets,
		selection,
		addSelection,
		removeSelection,
		fullSelection,
		clearSelection,
	} = useSnippets();

	const [userName, setUserName] = useState('kizu');
	const [defaultTheme, setDefaultTheme] = useState('light');

	const getDefaultTheme: JSXInternal.GenericEventHandler<HTMLInputElement> = ({ target }) => {
		if (!(target instanceof HTMLInputElement)) {
			return;
		}
		setDefaultTheme(target.value);
	};

	const {
		result: compiledSnippets,
		hasUserName,
		hasColorScheme,
	} = useMemo(() => {
		let result = '';

		let atRules = '';
		let regularRules = '';

		selection.forEach((item) => {
			const header = `/* ${item.textContent} */\n`;
			const content = `${snippets.get(item)?.map(snippet => snippet.textContent).join('\n\n')}\n\n`
			if (content[0] === '@') {
				atRules += header;
				atRules += content;
			} else {
				regularRules += header;
				regularRules += content;
			}
		});
		result += atRules;

		// TODO: make configurable
		const shouldOnlyApplyToDeck = regularRules !== '';

		if (shouldOnlyApplyToDeck) {
			result += '/* Only for the advanced interface */\n'
			result += '.layout-multiple-columns {\n\n'
		}

		result += regularRules;

		const hasUserName = result.includes('kizu');
		const hasColorScheme = result.includes('scheme: dark');

		if (hasUserName) {
			result = result.replaceAll('kizu', userName);
		}

		if (hasColorScheme && defaultTheme === 'dark') {
			result = result.replaceAll('scheme: dark', 'scheme: light');
		}

		result = '/* Copied from https://blog.kizu.dev/my-mastodon-css-overrides/ */\n\n' + result;

		return { result, hasUserName, hasColorScheme };
	}, [selection, snippets, userName, defaultTheme]);

	const content = (
		<fieldset>
			<legend>Copy all the overrides</legend>

			<fieldset>
				<legend>Options</legend>

				<fieldset>
					<legend>Select the snippets to include</legend>
					<details>
						<summary>
							{selection.size} / {snippets.size} selected
						</summary>
						<p>
							Select{' '}
							<button type="button" onClick={fullSelection}>all</button>{' '}
							<button type="button" onClick={clearSelection}>none</button>
						</p>
						{[...snippets.keys()].map((header, index) => (
							<p key={index}>
								<label>
									<CheckBox
										isChecked={selection.has(header)}
										onChange={isChecked => {
											if (isChecked) {
												addSelection(header);
											} else {
												removeSelection(header);
											}
										}}
									/>
									{' '}
									{header.textContent}
								</label>
								{' '}
								<a href={`#${header.id}`}>(<u>read more</u>)</a>
							</p>
						))}
					</details>
				</fieldset>

				{hasUserName ? (
					<fieldset>
						<legend>Replace the username</legend>
						<p>Some of the snippets target attributes that contain my username. You can replace it in the code automatically by changing this field (it should be local to your instance) (I do not collect any data written here)</p>
						<p>
							<TextInput value={userName} onChange={setUserName} />
						</p>
					</fieldset>
				) : null}

				{hasColorScheme ? (
					<p>
						Default theme:{' '}
						<label>
							<input type="radio" name="theme" value="light" checked={defaultTheme === 'light'} onChange={getDefaultTheme} />
							{' '}
							light
						</label>
						{' '}
						<label>
							<input type="radio" name="theme" value="dark" checked={defaultTheme === 'dark'} onChange={getDefaultTheme} />
							{' '}
							dark
						</label>
					</p>
				) : null}
			</fieldset>

			<textarea cols={46} rows={10} readOnly>
				{compiledSnippets}
			</textarea>

			<p>
				<button
					type="button"
					onClick={
						() => navigator.clipboard.writeText(compiledSnippets)
					}
				>
					Copy all the code from the textarea above
				</button>
			</p>
		</fieldset>
	);

	return (
		<details>
			<summary>Snippet Maker</summary>
			{snippets.size ? content : <p>No snippets found</p>}
		</details>
	)
};
