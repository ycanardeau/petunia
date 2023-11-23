import { ProjectFile } from '@/core/projects/Project';
import { TestingFramework } from '@/core/projects/TypeScriptProject';
import {
	IconLibrary,
	OutputType,
	TypeScriptViteReactProject,
	UIFramework,
} from '@/core/projects/TypeScriptViteReactProject';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { action, computed, makeObservable, observable } from 'mobx';
import prettier from 'prettier';
import babelParser from 'prettier/parser-babel';
import htmlParser from 'prettier/parser-html';
import typescriptParser from 'prettier/parser-typescript';
import validate from 'validate-npm-package-name';

export enum ProjectType {
	React = 'React',
}

export enum BuildTool {
	Vite = 'Vite',
}

export class TypeScriptViteReactProjectCreateStore {
	@observable outputType = OutputType.ReactApplication;
	@observable projectType = ProjectType.React;
	@observable projectName = 'react-app';
	@observable buildTool = BuildTool.Vite;
	@observable test = TestingFramework.None;
	@observable ui = UIFramework.None;
	@observable icon = IconLibrary.None;
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
	@observable useSwc = false;
	@observable useRouteSphere = false;

	@observable private _generateStores = true;
	@computed get generateStores(): boolean {
		return this.useRouteSphere && this._generateStores;
	}
	set generateStores(value: boolean) {
		this._generateStores = value;
	}

	@observable private _useAjv = false;
	@computed get useAjv(): boolean {
		return this.useRouteSphere || this._useAjv;
	}
	set useAjv(value: boolean) {
		this._useAjv = value;
	}

	@observable private _useLodash = false;
	@computed get useLodash(): boolean {
		return this.useRouteSphere || this._useLodash;
	}
	set useLodash(value: boolean) {
		this._useLodash = value;
	}

	@observable private _useMobX = false;
	@computed get useMobX(): boolean {
		return this.useRouteSphere || this._useMobX;
	}
	set useMobX(value: boolean) {
		this._useMobX = value;
	}

	@observable private _useQs = false;
	@computed get useQs(): boolean {
		return this.useRouteSphere || this._useQs;
	}
	set useQs(value: boolean) {
		this._useQs = value;
	}

	@observable private _useReactRouter = false;
	@computed get useReactRouter(): boolean {
		return this.useRouteSphere || this._useReactRouter;
	}
	set useReactRouter(value: boolean) {
		this._useReactRouter = value;
	}

	@observable configureCustomProxyRules = false;

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

	@action submit = async (): Promise<void> => {
		if (this.hasValidationErrors) {
			return;
		}

		const zip = new JSZip();
		const project = new TypeScriptViteReactProject(
			{ tab: '\t', newLine: '\n' },
			{
				outputType: this.outputType,
				projectName: this.projectName,
				test: this.test,
				ui: this.ui,
				icon: this.icon,
				enablePrettier: this.enablePrettier,
				sortImports: this.enablePrettier && this.sortImports,
				enableESLint: this.enableESLint,
				configurePathAliases: this.configurePathAliases,
				useAjv: this.useAjv,
				useLodash: this.useLodash,
				useMobX: this.useMobX,
				useQs: this.useQs,
				useReactRouter: this.useReactRouter,
				useSwc: this.useSwc,
				useRouteSphere: this.useRouteSphere,
				generateStores: this.generateStores,
				configureCustomProxyRules: this.configureCustomProxyRules,
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
