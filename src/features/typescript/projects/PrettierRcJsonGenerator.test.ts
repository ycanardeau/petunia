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

	test('generate sortImports', () => {
		const generator = new PrettierRcJsonGenerator(undefined, {
			sortImports: true,
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
