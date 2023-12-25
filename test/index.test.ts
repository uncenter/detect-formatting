import { describe, expect, test } from 'vitest';

import { detectIndent, detectNewline, detectQuotes, detectSemicolon } from '../src/index';

describe('detectIndent()', () => {
	test('should detect tab indent', () => {
		expect(detectIndent(`\t1;\n\t\t2;\n\t\t\t3;\n`)?.type).toBe('tab');
	});
	test('should detect space indent', () => {
		expect(detectIndent(`  1;\n    2;\n      3;\n`)?.type).toBe('space');
	});
	test('should detect most used indent with mixed', () => {
		expect(detectIndent(`  1;\n\t2;\n      3;\n`)?.type).toBe('space');
		expect(detectIndent(`  1;\n\t2;\n\t\t3;\n`)?.type).toBe('tab');
	});
	test('should be undefined with equal of both', () => {
		expect(detectIndent(`\t1;\n  2;\n`)).toBeUndefined();
	});
});

describe('detectNewline()', () => {
	test('should detect Windows-style newlines', () => {
		expect(detectNewline(`abc\r\ndef\r\n`)?.type).toBe('crlf');
	});
	test('should detect Unix-style newlines', () => {
		expect(detectNewline(`abc\ndef\n`)?.type).toBe('lf');
	});
	test('should detect most used type with mixed newlines', () => {
		expect(detectNewline(`abc\ndef\r\nghi\n`)?.type).toBe('lf');
		expect(detectNewline(`abc\ndef\r\nghi\r\n`)?.type).toBe('crlf');
	});
	test('should be undefined with equal of both', () => {
		expect(detectNewline(`abc\ndef\r\n`)).toBeUndefined();
	});
});

describe('detectSemicolon()', () => {
	test('should detect all semicolons', () => {
		expect(detectSemicolon(`1;\n2;\n`)).toBe(true);
	});
	test('should detect all not semicolons', () => {
		expect(detectSemicolon(`1\n2\n`)).toBe(false);
	});
	test('should detect with mixed usage of semicolons', () => {
		expect(detectSemicolon(`1;\n2;\n3\n`)).toBe(true);
		expect(detectSemicolon(`1\n2\n3;\n`)).toBe(false);
	});
	test('should be undefined with equal of both', () => {
		expect(detectSemicolon(`1;\n2\n`)).toBeUndefined();
	});
});

describe('detectQuotes()', () => {
	test('should detect all single quotes', () => {
		expect(detectQuotes(`'abc'\n'def'\n`)?.type).toBe('single');
	});
	test('should detect all double quotes', () => {
		expect(detectQuotes(`"abc"\n"def"\n`)?.type).toBe('double');
	});
	test('should detect with mixed usage of quotes', () => {
		expect(detectQuotes(`'abc'\n"def"\n'ghi'\n`)?.type).toBe('single');
		expect(detectQuotes(`"abc"\n"def"\n'ghi'\n`)?.type).toBe('double');
	});
	test('should be undefined with equal of both', () => {
		expect(detectQuotes(`'abc'\n"def"\n`)).toBeUndefined();
	});
});
