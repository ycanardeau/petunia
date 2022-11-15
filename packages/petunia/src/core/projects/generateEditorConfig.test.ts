import { generateEditorConfig } from '@/core/projects/generateEditorConfig';
import { expect, test } from 'vitest';

test('generateEditorConfig', () => {
	const actual = generateEditorConfig({ tab: '\t', newLine: '\n' });
	expect(actual).toBe(`root = true

[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
indent_style = tab
indent_size = 4
`);
});
