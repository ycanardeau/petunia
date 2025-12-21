import { Project, ProjectFile } from '@/features/common/projects/Project';
import { ESLintRcCjsGenerator } from '@/features/typescript/projects/ESLintRcCjsGenerator';
import { EditorConfigGenerator } from '@/features/typescript/projects/EditorConfigGenerator';
import { PackageManager } from '@/features/typescript/projects/PackageManager';
import { PrettierRcJsonGenerator } from '@/features/typescript/projects/PrettierRcJsonGenerator';

export enum TestingFramework {
	None = 'None',
	Vitest = 'Vitest',
	Jest = 'Jest',
}

export interface TypeScriptProjectOptions {
	projectName?: string;
	packageManager?: PackageManager;
	test?: TestingFramework;
	enablePrettier?: boolean;
	sortImports?: 'eslint-plugin-simple-import-sort';
	enableESLint?: boolean;
	installBoundaries?: boolean;
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
					sortImports: this.options.sortImports,
					extendsReactApp: this.isReactProject,
					installBoundaries: this.options.installBoundaries,
				}).generate(),
			};

			yield {
				path: 'eslint.config.js',
				text: `import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const compat = new FlatCompat({
	baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
});

export default [
	...fixupConfigRules(
		compat.config({
			extends: ['./.eslintrc.cjs'],
		}),
	),
];
`,
			};
		}
	}
}
