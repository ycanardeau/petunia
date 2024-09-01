import { ProjectFile } from '@/features/common/projects/Project';
import { FSharpFableProject } from '@/features/fsharp/projects/FSharpFableProject';
import { PackageManager } from '@/features/fsharp/projects/PackageManager';
import { TargetLanguage } from '@/features/fsharp/projects/TargetLanguage';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { action, computed, makeObservable, observable } from 'mobx';
import prettier from 'prettier';
import babelParser from 'prettier/parser-babel';
import htmlParser from 'prettier/parser-html';
import typescriptParser from 'prettier/parser-typescript';
import validate from 'validate-npm-package-name';

export class FSharpFableProjectCreateStore {
	@observable projectName = 'fable-app';
	@observable packageManager = PackageManager.NuGet;
	@observable targetLanguage = TargetLanguage.TypeScriptBrowser;
	@observable createSrcAndDistFolders = false;
	@observable useFableReact = false;
	@observable useFeliz = false;

	constructor() {
		makeObservable(this);
	}

	@computed get validationError_invalidProjectName(): boolean {
		const { validForNewPackages } = validate(this.projectName);
		return !validForNewPackages;
	}

	@computed get hasValidationErrors(): boolean {
		return this.validationError_invalidProjectName;
	}

	private tryFormat({ path, text }: ProjectFile): string | undefined {
		try {
			return prettier.format(text, {
				filepath: path,
				plugins: [babelParser, htmlParser, typescriptParser],
				singleQuote: true,
				trailingComma: 'all',
				endOfLine: 'lf',
				useTabs: true,
			});
		} catch (error) {
			console.error(error);
		}
	}

	@action.bound async submit(): Promise<void> {
		if (this.hasValidationErrors) {
			return;
		}

		const zip = new JSZip();

		const project = new FSharpFableProject(
			{ tab: '\t', newLine: '\n' },
			{
				projectName: this.projectName,
				packageManager: this.packageManager,
				targetLanguage: this.targetLanguage,
				createSrcAndDistFolders: this.createSrcAndDistFolders,
				useFableReact: this.useFableReact,
				useFeliz: this.useFeliz,
			},
		);
		const projectFiles = Array.from(project.generateProjectFiles()).map(
			(projectFile) => {
				return {
					path: `${this.projectName}/${projectFile.path}`,
					text: this.tryFormat(projectFile) ?? projectFile.text,
				};
			},
		);
		for (const { path, text } of projectFiles) {
			zip.file(path, text);
		}

		const content = await zip.generateAsync({
			type: 'blob',
		});
		FileSaver.saveAs(content, `${this.projectName}.zip`);
	}
}
