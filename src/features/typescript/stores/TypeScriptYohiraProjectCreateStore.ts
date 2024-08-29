import { OrmFramework } from '@/features/typescript/projects/OrmFramework';
import { PackageManager } from '@/features/typescript/projects/PackageManager';
import { ProjectFile } from '@/features/typescript/projects/Project';
import { TestingFramework } from '@/features/typescript/projects/TypeScriptProject';
import {
	IconLibrary,
	UIFramework,
} from '@/features/typescript/projects/TypeScriptViteReactProject';
import { TypeScriptYohiraFullStackProject } from '@/features/typescript/projects/TypeScriptYohiraFullStackProject';
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
	@observable packageManager = PackageManager.Pnpm;
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

	@observable buildAndDeployToServerViaSsh = false;

	@observable _generateDockerfile = false;
	@computed get generateDockerfile(): boolean {
		return this.buildAndDeployToServerViaSsh || this._generateDockerfile;
	}
	set generateDockerfile(value: boolean) {
		this._generateDockerfile = value;
	}

	@observable _deployToSubdirectory = false;
	get deployToSubdirectory(): boolean {
		return this.buildAndDeployToServerViaSsh || this._deployToSubdirectory;
	}
	set deployToSubdirectory(value: boolean) {
		this._deployToSubdirectory = value;
	}

	@observable _setUpLetsEncrypt = true;
	get setUpLetsEncrypt(): boolean {
		return this.buildAndDeployToServerViaSsh && this._setUpLetsEncrypt;
	}
	set setUpLetsEncrypt(value: boolean) {
		this._setUpLetsEncrypt = value;
	}

	@observable _httpBasicAuthentication = false;
	get httpBasicAuthentication(): boolean {
		return this.setUpLetsEncrypt && this._httpBasicAuthentication;
	}
	set httpBasicAuthentication(value: boolean) {
		this._httpBasicAuthentication = value;
	}

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

		const project = new TypeScriptYohiraFullStackProject(
			{ tab: '\t', newLine: '\n' },
			{
				projectName: this.projectName,
				packageManager: this.packageManager,
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
				generateDockerfile: this.generateDockerfile,
				ui: this.ui,
				icon: this.icon,
				deployToSubdirectory: this.deployToSubdirectory,
				buildAndDeployToServerViaSsh: this.buildAndDeployToServerViaSsh,
				httpBasicAuthentication: this.httpBasicAuthentication,
				letsEncrypt: this.setUpLetsEncrypt
					? {
							domain: 'example.org' /* TODO */,
							email: '',
					  }
					: undefined,
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
