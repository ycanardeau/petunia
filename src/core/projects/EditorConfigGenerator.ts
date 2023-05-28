import { SourceTextGenerator } from '@/core/projects/SourceTextGenerator';

export class EditorConfigGenerator extends SourceTextGenerator {
	generate(): string {
		const lines: string[] = [];
		lines.push('root = true');
		lines.push('');
		lines.push('[*]');
		lines.push('end_of_line = lf');
		lines.push('charset = utf-8');
		lines.push('trim_trailing_whitespace = true');
		lines.push('insert_final_newline = true');
		lines.push('indent_style = tab');
		lines.push('indent_size = 4');
		return this.joinLines(lines);
	}
}
