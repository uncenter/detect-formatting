export function stripComments(contents: string) {
	return contents.replaceAll(/\/\/.*$\n?/gm, '').replaceAll(/\/\*[\S\s]*?\*\//g, '');
}

export function getLines(contents: string) {
	contents = stripComments(contents);
	return contents === '' ? undefined : contents.split('\n').filter(Boolean);
}

export function countMatchingLines(lines: string[], regex: RegExp) {
	return lines.filter((each) => each.match(regex)).length;
}
