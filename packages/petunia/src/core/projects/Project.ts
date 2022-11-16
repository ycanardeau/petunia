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
		readonly editorConfig: EditorConfig,
		readonly options: TOptions,
	) {}

	abstract generateProjectFiles(): Generator<ProjectFile>;
}
