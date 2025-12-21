import { PrettierRcJsonGenerator } from '@/features/typescript/projects/PrettierRcJsonGenerator';
import { describe, expect, test } from 'vitest';

describe('PrettierRcJsonGenerator', () => {
	test('generate', () => {
		const generator = new PrettierRcJsonGenerator(undefined, {});
		const actual = generator.generate();
		const expected = `{
	"singleQuote": true,
	"trailingComma": "all"
}
`;
		expect(actual).toBe(expected);
	});

	test('generate sortImports eslint-plugin-simple-import-sort', () => {
		const generator = new PrettierRcJsonGenerator(undefined, {
			sortImports: 'eslint-plugin-simple-import-sort',
		});
		const actual = generator.generate();
		const expected = `{
	"singleQuote": true,
	"trailingComma": "all"
}
`;
		expect(actual).toBe(expected);
	});
});
