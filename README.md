# detect-formatting

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
// { type: 'spaces' | 'tabs', indent: string }
detectNewline(file);
// { type: 'lf' | 'crlf', newline: '\n' | '\r\n' }
detectSemicolon(file);
// boolean
detectQuotes(file);
// { type: 'single' | 'double', quotes: "'" | '"' }
```

## License

[MIT](LICENSE)

> [!NOTE]
> The `detectIndent()` and `detectNewline()` functions are largely based on Sindre Sorhus' packages, `detect-indent` and `detect-newline`.
