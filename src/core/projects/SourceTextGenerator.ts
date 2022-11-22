import { EditorConfig } from '@/core/projects/Project';

export abstract class SourceTextGenerator {
	constructor(
		readonly editorConfig: EditorConfig = { tab: '\t', newLine: '\n' },
	) {}

	protected joinLines = (lines: string[]): string => {
		const { newLine } = this.editorConfig;
		return `${lines.join(newLine)}${newLine}`;
	};

	abstract generate(): string;
}
