import { PrettierRcJsonGenerator } from '@/core/projects/PrettierRcJsonGenerator';
import { describe, expect, test } from 'vitest';

describe('PrettierRcJsonGenerator', () => {
	test('generate', () => {
		const generator = new PrettierRcJsonGenerator(undefined, {});
		const actual = generator.generate();
		const expected = `{
	"singleQuote": true,
	"trailingComma": "all",
	"plugins": [
		"@trivago/prettier-plugin-sort-imports"
	]
}
`;
		expect(actual).toBe(expected);
	});

	test('generate sortImports', () => {
		const generator = new PrettierRcJsonGenerator(undefined, {
			sortImports: true,
		});
		const actual = generator.generate();
		const expected = `{
	"singleQuote": true,
	"trailingComma": "all",
	"importOrder": [
		"^@core/(.*)$",
		"^@server/(.*)$",
		"^@ui/(.*)$",
		"^[./]"
	],
	"importOrderSeparation": true,
	"importOrderSortSpecifiers": true,
	"importOrderParserPlugins": [
		"jsx",
		"typescript",
		"importOrderParserPlugins",
		"classProperties",
		"decorators-legacy",
		"importAssertions"
	],
	"plugins": [
		"@trivago/prettier-plugin-sort-imports"
	]
}
`;
		expect(actual).toBe(expected);
	});
});
