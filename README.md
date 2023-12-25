# detect-formatting

Detect the indentation, newline style, quotes style, and usage of semicolons of a JavaScript file.

## Installation

```sh
npm i detect-formatting
pnpm add detect-formatting
yarn add detect-formatting
bun add detect-formatting
```

## Usage

```ts
import { detectIndent, detectNewline, detectSemicolon, detectQuotes } from 'detect-formatting';
import { readFileSync } from 'node:fs';

const file = readFileSync('index.js', 'utf-8');

detectIndent(file);
// { type: 'space' | 'tab', amount: number, indent: string } | undefined
detectNewline(file);
// { type: 'lf' | 'crlf', newline: '\n' | '\r\n' } | undefined
detectSemicolon(file);
// boolean | undefined
detectQuotes(file);
// { type: 'single' | 'double', quotes: "'" | '"' } | undefined
```

## License

[MIT](LICENSE)

> [!NOTE]
> The `detectIndent()` and `detectNewline()` functions are largely based on Sindre Sorhus' packages, [`detect-indent`](https://github.com/sindresorhus/detect-indent) and [`detect-newline`](https://github.com/sindresorhus/detect-newline). Licences for the two can be found in [`COPYING.md`](COPYING.md).
