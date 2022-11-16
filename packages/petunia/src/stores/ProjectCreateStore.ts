import { TypeScriptViteReactProject } from '@/core/projects/TypeScriptViteReactProject';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { makeObservable, observable } from 'mobx';

export enum ProjectType {
	React = 'React',
}

export enum BuildTool {
	Vite = 'Vite',
}

export enum TestingFramework {
	None = 'None',
	Vitest = 'Vitest',
}

export enum UIFramework {
	None = 'None',
	ElasticUI = 'ElasticUI',
}

export enum IconLibrary {
	None = 'None',
	FluentSystemIcons = 'FluentSystemIcons',
}

export class ProjectCreateStore {
	@observable projectType = ProjectType.React;
	@observable projectName = '';
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

	submit = async (): Promise<void> => {
		const zip = new JSZip();
		const project = new TypeScriptViteReactProject(
			{ tab: '\t', newLine: '\n' },
			{
				test: this.test,
				ui: this.ui,
				icon: this.icon,
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
			zip.file(
				`${this.projectName}/${path}` /* TODO: Use path.join */,
				text,
			);
		}
		const content = await zip.generateAsync({
			type: 'blob',
		});
		FileSaver.saveAs(content, `${this.projectName}.zip`);
	};
}
