function detectIndent() {}

// https://github.com/sindresorhus/detect-newline
function detectNewline(
	contents: string,
): { type: 'lf' | 'crlf'; newline: '\n' | '\r\n' } | undefined {
	const newlines = contents.match(/(?:\r?\n)/g) || [];

	if (newlines.length === 0) return;

	const crlf = newlines.filter((newline) => newline === '\r\n').length;
	const lf = newlines.length - crlf;

	if (crlf > lf) {
		return { type: 'crlf', newline: '\r\n' };
	} else if (crlf < lf) {
		return { type: 'lf', newline: '\n' };
	} else {
		return;
	}
}

function detectSemicolon(contents: string): boolean | undefined {
	contents = contents.replaceAll(/\/\/.*$\n/gm, '');
	if (contents === '') return;

	const lines = contents.split('\n').filter(Boolean);

	const endsInOther = lines.filter((each) => each.match(/^.+[(),{}]\s*$/gm)).length;
	const endsInSemicolon = lines.filter((each) => each.match(/^.+;\s*$/gm)).length;
	const endsInNotSemicolon = lines.length - endsInOther - endsInSemicolon;

	if (endsInSemicolon > endsInNotSemicolon) {
		return true;
	} else if (endsInSemicolon < endsInNotSemicolon) {
		return false;
	} else {
		return;
	}
}

function detectQuotes(
	contents: string,
): { type: 'single' | 'double'; quotes: '"' | "'" } | undefined {
	const singleQuotes = (contents.match(/(?<!\\)'/gm) || []).length;
	const doubleQuotes = (contents.match(/(?<!\\)"/gm) || []).length;

	if (singleQuotes > doubleQuotes) {
		return {
			type: 'single',
			quotes: "'",
		};
	} else if (singleQuotes < doubleQuotes) {
		return {
			type: 'double',
			quotes: '"',
		};
	} else {
		return;
	}
}

export { detectIndent, detectNewline, detectSemicolon, detectQuotes };
