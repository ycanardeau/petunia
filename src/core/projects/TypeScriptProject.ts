import { ESLintRcCjsGenerator } from '@/core/projects/ESLintRcCjsGenerator';
import { EditorConfigGenerator } from '@/core/projects/EditorConfigGenerator';
import { PrettierRcJsonGenerator } from '@/core/projects/PrettierRcJsonGenerator';
import { Project, ProjectFile } from '@/core/projects/Project';

export enum TestingFramework {
	None = 'None',
	Vitest = 'Vitest',
	Jest = 'Jest',
}

export interface TypeScriptProjectOptions {
	projectName?: string;
	test?: TestingFramework;
	enablePrettier?: boolean;
	sortImports?: boolean;
	enableESLint?: boolean;
	configurePathAliases?: boolean;
	useAjv?: boolean;
	useLodash?: boolean;
	useQs?: boolean;
}

export abstract class TypeScriptProject<
	TOptions extends TypeScriptProjectOptions,
> extends Project<TOptions> {
	get isReactProject(): boolean {
		return false;
	}

	*generateProjectFiles(): Generator<ProjectFile> {
		yield {
			path: '.editorconfig',
			text: new EditorConfigGenerator(this.editorConfig, {}).generate(),
		};

		if (this.options.enablePrettier) {
			yield {
				path: '.prettierrc.json',
				text: new PrettierRcJsonGenerator(this.editorConfig, {
					sortImports: this.options.sortImports,
				}).generate(),
			};
		}

		if (this.options.enableESLint) {
			yield {
				path: '.eslintrc.cjs',
				text: new ESLintRcCjsGenerator(this.editorConfig, {
					extendsReactApp: this.isReactProject,
				}).generate(),
			};
		}
	}
}
