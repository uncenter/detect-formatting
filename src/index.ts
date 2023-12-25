// https://github.com/sindresorhus/detect-indent

/**
Make a Map that counts how many indents/unindents have occurred for a given size and how many lines follow a given indentation.

The key is a concatenation of the indentation type (s = space and t = tab) and the size of the indents/unindents.

```
indents = {
	t3: [1, 0],
	t4: [1, 5],
	s5: [1, 0],
	s12: [1, 0],
}
```
*/

function makeIndentsMap(contents: string, ignoreSingleSpaces: boolean): Map<string, number[]> {
	const indents = new Map();

	// Remember the size of previous line's indentation.
	let previousSize = 0;
	let previousIndentType;

	// Indents key (indent type + size of the indents/unindents).
	let key;

	for (const line of contents.split(/\n/g)) {
		if (!line) continue;

		let indent;
		let indentType;
		let use;
		let weight;
		let entry;
		const matches = line.match(/^(?:( )+|\t+)/);

		if (matches === null) {
			previousSize = 0;
			previousIndentType = '';
		} else {
			indent = matches[0].length;
			indentType = (matches[1] ? 'space' : 'tab') as 'tab' | 'space';

			// Ignore single space unless it's the only indent detected to prevent common false positives.
			if (ignoreSingleSpaces && indentType === 'space' && indent === 1) {
				continue;
			}

			if (indentType !== previousIndentType) {
				previousSize = 0;
			}

			previousIndentType = indentType;

			use = 1;
			weight = 0;

			const indentDifference = indent - previousSize;
			previousSize = indent;

			// Previous line have same indent?
			if (indentDifference === 0) {
				// Not a new "use" of the current indent:
				use = 0;
				// But do add a bit to it for breaking ties:
				weight = 1;
				// We use the key from previous loop.
			} else {
				const absoluteIndentDifference =
					indentDifference > 0 ? indentDifference : -indentDifference;
				key = encodeIndentsKey(indentType, absoluteIndentDifference);
			}

			// Update the stats.
			entry = indents.get(key);
			entry = entry === undefined ? [1, 0] : [entry[0] + use, entry[1] + weight];

			indents.set(key, entry);
		}
	}

	return indents;
}

// Encode the indent type and amount as a string (e.g. 's4') for use as a compound key in the indents Map.
function encodeIndentsKey(type: 'tab' | 'space', amount: number) {
	return type.at(0) + amount.toString();
}

// Extract the indent type and amount from a key of the indents Map.
function decodeIndentsKey(indentsKey: string): { type: 'tab' | 'space'; amount: number } {
	const type = indentsKey.at(0) === 't' ? 'tab' : 'space';
	const amount = Number.parseInt(indentsKey.slice(1));

	return { type, amount };
}

// Return the key (e.g. 's4') from the indents Map that represents the most common indent,
// or return undefined if there are no indents.
function getMostUsedKey(indents: Map<string, number[]>) {
	let result;
	let maxUsed = 0;
	let maxWeight = 0;

	for (const [key, [usedCount, weight]] of indents) {
		if (usedCount > maxUsed || (usedCount === maxUsed && weight > maxWeight)) {
			maxUsed = usedCount;
			maxWeight = weight;
			result = key;
		}
	}

	return result;
}

function detectIndent(
	contents: string,
): { type: 'tab' | 'space'; amount: number; indent: string } | undefined {
	// Identify indents while skipping single space indents to avoid common edge cases (e.g. code comments).
	// If no indents are identified, run again and include all indents for comprehensive detection.
	let indents = makeIndentsMap(contents, true);
	if (indents.size === 0) {
		indents = makeIndentsMap(contents, false);
	}

	console.log(indents);

	const keyOfMostUsedIndent = getMostUsedKey(indents);
	if (keyOfMostUsedIndent === undefined) return;

	const { type, amount } = decodeIndentsKey(keyOfMostUsedIndent);
	const indent = (type === 'tab' ? '\t' : ' ').repeat(amount);

	return {
		type,
		amount,
		indent,
	};
}

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
