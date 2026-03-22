import { EditorConfigGenerator } from '@/features/typescript/projects/EditorConfigGenerator';
import { describe, expect, test } from 'vitest';

describe('EditorConfigGenerator', () => {
	test('generate', () => {
		const actual = new EditorConfigGenerator(undefined, {}).generate();
		const expected = `root = true

[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
indent_style = tab
indent_size = 4

[{*.yml,*.yaml}]
indent_style = space
indent_size = 2
`;
		expect(actual).toBe(expected);
	});
});
