export interface EditorConfig {
	tab: string;
	newLine: string;
}

export interface ProjectFile {
	path: string;
	text: string;
}

export abstract class Project<TOptions> {
	constructor(
		readonly editorConfig: EditorConfig = { tab: '\t', newLine: '\n' },
		readonly options: TOptions,
	) {}

	protected joinLines(lines: string[]): string {
		const { newLine } = this.editorConfig;
		return `${lines.join(newLine)}${newLine}`;
	}

	abstract generateProjectFiles(): Generator<ProjectFile>;
}
