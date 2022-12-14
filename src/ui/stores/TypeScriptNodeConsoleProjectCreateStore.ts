import { ProjectFile } from '@/core/projects/Project';
import { TypeScriptNodeConsoleProject } from '@/core/projects/TypeScriptNodeConsoleProject';
import { TestingFramework } from '@/core/projects/TypeScriptProject';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { action, computed, makeObservable, observable } from 'mobx';
import prettier from 'prettier';
import babelParser from 'prettier/parser-babel';
import htmlParser from 'prettier/parser-html';
import typescriptParser from 'prettier/parser-typescript';
import validate from 'validate-npm-package-name';

export class TypeScriptNodeConsoleProjectCreateStore {
	@observable projectName = 'console-app';
	@observable test = TestingFramework.None;
	@observable enablePrettier = true;
	@observable sortImports = true;
	@observable enableESLint = true;
	@observable configurePathAliases = true;
	@observable useAjv = false;
	@observable useLodash = false;
	@observable useQs = false;

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

	private tryFormat = ({ path, text }: ProjectFile): string | undefined => {
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
	};

	@action submit = async (): Promise<void> => {
		if (this.hasValidationErrors) {
			return;
		}

		const zip = new JSZip();
		const project = new TypeScriptNodeConsoleProject(
			{ tab: '\t', newLine: '\n' },
			{
				projectName: this.projectName,
				test: this.test,
				enablePrettier: this.enablePrettier,
				sortImports: this.enablePrettier && this.sortImports,
				enableESLint: this.enableESLint,
				configurePathAliases: this.configurePathAliases,
				useAjv: this.useAjv,
				useLodash: this.useLodash,
				useQs: this.useQs,
			},
		);
		const projectFiles = Array.from(project.generateProjectFiles()).map(
			(projectFile) => {
				return {
					path: projectFile.path,
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
	};
}
