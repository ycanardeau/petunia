import { EditorConfig } from '@/features/typescript/projects/Project';

export abstract class SourceTextGenerator<TOptions = unknown> {
	constructor(
		readonly editorConfig: EditorConfig = { tab: '\t', newLine: '\n' },
		readonly options: TOptions,
	) {}

	protected joinLines(lines: string[]): string {
		const { newLine } = this.editorConfig;
		return `${lines.join(newLine)}${newLine}`;
	}

	abstract generate(): string;
}
