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
	@observable sortImports = true;
	@observable configurePathAliases = true;
	@observable useAjv = false;
	@observable useLodash = false;
	@observable useMobX = false;
	@observable useReactRouter = false;
	@observable useQs = false;

	constructor() {
		makeObservable(this);
	}
}
