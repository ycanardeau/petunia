import { OrmFramework } from '@/core/projects/OrmFramework';
import { ProjectFile } from '@/core/projects/Project';
import { TestingFramework } from '@/core/projects/TypeScriptProject';
import {
	IconLibrary,
	OutputType,
	TypeScriptViteReactProject,
	UIFramework,
} from '@/core/projects/TypeScriptViteReactProject';
import { TypeScriptYohiraProject } from '@/core/projects/TypeScriptYohiraProject';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { action, computed, makeObservable, observable } from 'mobx';
import prettier from 'prettier';
import babelParser from 'prettier/parser-babel';
import htmlParser from 'prettier/parser-html';
import typescriptParser from 'prettier/parser-typescript';
import validate from 'validate-npm-package-name';

export enum BuildTool {
	Vite = 'Vite',
}

export class TypeScriptYohiraProjectCreateStore {
	@observable projectName = 'web-app';
	@observable buildTool = BuildTool.Vite;
	@observable test = TestingFramework.Vitest;
	@observable ui = UIFramework.ElasticUI;
	@observable icon = IconLibrary.FluentSystemIcons;
	@observable enablePrettier = true;

	@observable private _sortImports = true;
	@computed get sortImports(): boolean {
		return this.enablePrettier && this._sortImports;
	}
	set sortImports(value: boolean) {
		this._sortImports = value;
	}

	@observable enableESLint = true;
	@observable configurePathAliases = true;

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

		const backendProject = new TypeScriptYohiraProject(
			{ tab: '\t', newLine: '\n' },
			{
				projectName: 'backend',
				test: this.test,
				orm: OrmFramework.MikroOrm /* TODO */,
				enablePrettier: this.enablePrettier,
				sortImports: this.sortImports,
				enableESLint: this.enableESLint,
				configurePathAliases: this.configurePathAliases,
				useAjv: true,
				useLodash: true,
				useQs: true,
				useYohira: true,
				useBcrypt: true,
			},
		);
		const projectFiles = Array.from(
			backendProject.generateProjectFiles(),
		).map((projectFile) => {
			return {
				path: `${this.projectName}/backend/${projectFile.path}`,
				text: this.tryFormat(projectFile) ?? projectFile.text,
			};
		});
		for (const { path, text } of projectFiles) {
			zip.file(path, text);
		}

		const frontendProject = new TypeScriptViteReactProject(
			{ tab: '\t', newLine: '\n' },
			{
				reactMajorVersion: this.ui === UIFramework.Mantine ? 18 : 17,
				outputType: OutputType.ReactApplication,
				projectName: 'frontend',
				test: this.test,
				ui: this.ui,
				icon: this.icon,
				enablePrettier: this.enablePrettier,
				sortImports: this.sortImports,
				enableESLint: this.enableESLint,
				configurePathAliases: this.configurePathAliases,
				useAjv: true,
				useLodash: true,
				useMobX: true,
				useQs: true,
				useReactRouter: true,
				useSwc: false,
				useRouteSphere: true,
				generateStores: true,
				configureCustomProxyRules: true,
			},
		);
		const frontendProjectFiles = Array.from(
			frontendProject.generateProjectFiles(),
		).map((projectFile) => {
			return {
				path: `${this.projectName}/frontend/${projectFile.path}`,
				text: this.tryFormat(projectFile) ?? projectFile.text,
			};
		});
		for (const { path, text } of frontendProjectFiles) {
			zip.file(path, text);
		}

		const content = await zip.generateAsync({
			type: 'blob',
		});
		FileSaver.saveAs(content, `${this.projectName}.zip`);
	}
}
