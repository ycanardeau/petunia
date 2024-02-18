import { Database } from '@/core/projects/Database';
import { OrmFramework } from '@/core/projects/OrmFramework';
import { EditorConfig, ProjectFile } from '@/core/projects/Project';
import {
	TypeScriptProject,
	TypeScriptProjectOptions,
} from '@/core/projects/TypeScriptProject';
import {
	IconLibrary,
	OutputType,
	TypeScriptViteReactProject,
	UIFramework,
} from '@/core/projects/TypeScriptViteReactProject';
import { TypeScriptYohiraBackendProject } from '@/core/projects/TypeScriptYohiraBackendProject';

interface TypeScriptYohiraFullStackProjectOptions
	extends TypeScriptProjectOptions {
	orm?: OrmFramework;
	database?: Database;
	useYohira?: boolean;
	useBcrypt?: boolean;
	generateDockerfile?: boolean;
	ui?: UIFramework;
	icon?: IconLibrary;
	deployToSubdirectory?: boolean;
}

export class TypeScriptYohiraFullStackProject extends TypeScriptProject<TypeScriptYohiraFullStackProjectOptions> {
	private readonly typeScriptYohiraBackendProject: TypeScriptYohiraBackendProject;
	private readonly typeScriptViteReactProject: TypeScriptViteReactProject;

	constructor(
		editorConfig: EditorConfig,
		options: TypeScriptYohiraFullStackProjectOptions,
	) {
		super(editorConfig, options);

		this.typeScriptYohiraBackendProject =
			new TypeScriptYohiraBackendProject(editorConfig, {
				projectName: `${this.options.projectName}.backend`,
				test: this.options.test,
				orm: OrmFramework.MikroOrm /* TODO */,
				enablePrettier: this.options.enablePrettier,
				sortImports: this.options.sortImports,
				enableESLint: this.options.enableESLint,
				configurePathAliases: this.options.configurePathAliases,
				useAjv: true,
				useLodash: true,
				useQs: true,
				useYohira: true,
				useBcrypt: true,
				generateDockerfile: this.options.generateDockerfile,
			});

		this.typeScriptViteReactProject = new TypeScriptViteReactProject(
			editorConfig,
			{
				reactMajorVersion:
					this.options.ui === UIFramework.Mantine ? 18 : 17,
				outputType: OutputType.ReactApplication,
				projectName: `${this.options.projectName}.frontend`,
				test: this.options.test,
				ui: this.options.ui,
				icon: this.options.icon,
				enablePrettier: this.options.enablePrettier,
				sortImports: this.options.sortImports,
				enableESLint: this.options.enableESLint,
				configurePathAliases: this.options.configurePathAliases,
				useAjv: true,
				useLodash: true,
				useMobX: true,
				useQs: true,
				useReactRouter: true,
				useSwc: false,
				useRouteSphere: true,
				generateStores: true,
				configureCustomProxyRules: true,
				generateDockerfile: this.options.generateDockerfile,
				publicBasePath: this.options.deployToSubdirectory
					? this.options.projectName
					: undefined,
			},
		);
	}

	*generateProjectFiles(): Generator<ProjectFile> {
		for (const projectFile of this.typeScriptYohiraBackendProject.generateProjectFiles()) {
			yield {
				path: `packages/${this.typeScriptYohiraBackendProject.options.projectName}/${projectFile.path}`,
				text: projectFile.text,
			};
		}

		for (const projectFile of this.typeScriptViteReactProject.generateProjectFiles()) {
			yield {
				path: `packages/${this.typeScriptViteReactProject.options.projectName}/${projectFile.path}`,
				text: projectFile.text,
			};
		}
	}
}
