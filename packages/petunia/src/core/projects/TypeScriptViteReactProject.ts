import { Project, ProjectFile } from '@/core/projects/Project';
import { generateEditorConfig } from '@/core/projects/generateEditorConfig';
import { generatePrettierRcJson } from '@/core/projects/generatePrettierRcJson';

export class TypeScriptViteReactProject extends Project {
	*generateProjectFiles(): Generator<ProjectFile> {
		yield {
			path: '.editorconfig',
			text: generateEditorConfig(this.options.editorConfig),
		};
		yield {
			path: '.prettierrc.json',
			text: generatePrettierRcJson(this.options.editorConfig),
		};
	}
}
