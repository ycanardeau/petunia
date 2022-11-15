import { generatePrettierRcJson } from '@/core/projects/generatePrettierRcJson';
import { expect, test } from 'vitest';

test('generatePrettierRcJson', () => {
	const actual = generatePrettierRcJson({ tab: '\t', newLine: '\n' });
	expect(actual).toBe(`{
	"singleQuote": true,
	"trailingComma": "all",
	"importOrder": [
		"^@core/(.*)$",
		"^@server/(.*)$",
		"^@ui/(.*)$",
		"^[./]"
	],
	"importOrderSeparation": true,
	"importOrderSortSpecifiers": true
}
`);
});
