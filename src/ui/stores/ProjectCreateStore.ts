import {
	IconLibrary,
	OutputType,
	TestingFramework,
	TypeScriptViteReactProject,
	UIFramework,
} from '@/core/projects/TypeScriptViteReactProject';
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

export class ProjectCreateStore {
	@observable outputType = OutputType.ReactApplication;
	@observable projectType = ProjectType.React;
	@observable projectName = 'react-app';
	@observable buildTool = BuildTool.Vite;
	@observable test = TestingFramework.None;
	@observable ui = UIFramework.None;
	@observable icon = IconLibrary.None;
	@observable enablePrettier = true;
	@observable sortImports = true;
	@observable enableESLint = true;
	@observable configurePathAliases = true;
	@observable useAjv = false;
	@observable useLodash = false;
	@observable useMobX = false;
	@observable useQs = false;
	@observable useReactRouter = false;

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
			},
		);
		const projectFiles = project.generateProjectFiles();
		for (const { path, text } of projectFiles) {
			zip.file(path, text);
		}
		const content = await zip.generateAsync({
			type: 'blob',
		});
		FileSaver.saveAs(content, `${this.projectName}.zip`);
	};
}
