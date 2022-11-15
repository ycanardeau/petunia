export interface EditorConfig {
	tab: string;
	newLine: string;
}

interface ProjectOptions {
	editorConfig: EditorConfig;
}

export interface ProjectFile {
	path: string;
	text: string;
}

export abstract class Project {
	protected constructor(readonly options: ProjectOptions) {}

	abstract generateProjectFiles(): Generator<ProjectFile>;
}
