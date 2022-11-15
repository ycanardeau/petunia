import { EditorConfig } from '@/core/projects/Project';

export const generateEditorConfig = (editorConfig: EditorConfig): string => {
	const result: string[] = [];

	result.push('root = true');
	result.push('');
	result.push('[*]');
	result.push('end_of_line = lf');
	result.push('charset = utf-8');
	result.push('trim_trailing_whitespace = true');
	result.push('insert_final_newline = true');
	result.push('indent_style = tab');
	result.push('indent_size = 4');

	return `${result.join(editorConfig.newLine)}${editorConfig.newLine}`;
};
