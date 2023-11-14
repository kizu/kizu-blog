import classNamesLib from 'classnames';

// Wrapping the lib to re-export as a named, and to make it return undefined if the result is an empty string, in order to not output empty `class=""`.
export const classNames = (...args: Parameters<typeof classNamesLib>): string | undefined => classNamesLib(...args) || undefined;
