import { tryFormat } from '@/features/common/helpers/tryFormat';
import { PackageManager } from '@/features/typescript/projects/PackageManager';
import { TestingFramework } from '@/features/typescript/projects/TypeScriptProject';
import {
	IconLibrary,
	OutputType,
	TypeScriptViteReactProject,
	UIFramework,
} from '@/features/typescript/projects/TypeScriptViteReactProject';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { action, computed, makeObservable, observable } from 'mobx';
import validate from 'validate-npm-package-name';

export enum ProjectType {
	React = 'React',
}

export enum BuildTool {
	Vite = 'Vite',
}

export class TypeScriptViteReactProjectCreateStore {
	@observable outputType = OutputType.ReactApplication;
	@observable packageManager = PackageManager.Pnpm;
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

	@observable private _installBoundaries = true;
	@computed get installBoundaries(): boolean {
		return this.enableESLint && this._installBoundaries;
	}
	set installBoundaries(value: boolean) {
		this._installBoundaries = value;
	}

	@observable configurePathAliases = true;
	@observable generateDockerfile = false;
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
	@observable useHttps = false;

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

	@action.bound async submit(): Promise<void> {
		if (this.hasValidationErrors) {
			return;
		}

		const zip = new JSZip();

		const project = new TypeScriptViteReactProject(
			{ tab: '\t', newLine: '\n' },
			{
				reactMajorVersion: 18,
				outputType: this.outputType,
				projectName: this.projectName,
				packageManager: this.packageManager,
				test: this.test,
				ui: this.ui,
				icon: this.icon,
				enablePrettier: this.enablePrettier,
				sortImports: this.sortImports
					? '@trivago/prettier-plugin-sort-imports'
					: undefined,
				enableESLint: this.enableESLint,
				installBoundaries: this.installBoundaries,
				configurePathAliases: this.configurePathAliases,
				generateDockerfile: this.generateDockerfile,
				useAjv: this.useAjv,
				useLodash: this.useLodash,
				useMobX: this.useMobX,
				useQs: this.useQs,
				useReactRouter: this.useReactRouter,
				useSwc: this.useSwc,
				useRouteSphere: this.useRouteSphere,
				generateStores: this.generateStores,
				configureCustomProxyRules: this.configureCustomProxyRules,
				useHttps: this.useHttps,
			},
		);
		const projectFiles = Array.from(project.generateProjectFiles()).map(
			(projectFile) => {
				return {
					path: `${this.projectName}/${projectFile.path}`,
					text: tryFormat(projectFile),
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
