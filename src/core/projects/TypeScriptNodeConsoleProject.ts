import { JsonArray, JsonObject } from '@/core/JsonValue';
import { NodeGitignoreGenerator } from '@/core/projects/NodeGitignoreGenerator';
import { PackageJsonDependency } from '@/core/projects/PackageJsonDependency';
import { ProjectFile } from '@/core/projects/Project';
import {
	TestingFramework,
	TypeScriptProject,
	TypeScriptProjectOptions,
} from '@/core/projects/TypeScriptProject';
import dependencies from '@/core/projects/dependencies.json' assert { type: 'json' };
import validate from 'validate-npm-package-name';

type TypeScriptNodeConsoleProjectOptions = TypeScriptProjectOptions;

export class TypeScriptNodeConsoleProject extends TypeScriptProject<TypeScriptNodeConsoleProjectOptions> {
	get isReactProject(): boolean {
		return false;
	}

	generatePackageJson = (): string => {
		if (this.options.projectName !== undefined) {
			const { validForNewPackages } = validate(this.options.projectName);
			if (!validForNewPackages) {
				throw new Error('Invalid project name');
			}
		}

		const { tab, newLine } = this.editorConfig;

		const devDependenciesObj = new PackageJsonDependency().addPackage(
			'typescript',
		);

		const dependenciesObj = new PackageJsonDependency();

		switch (this.options.test) {
			case TestingFramework.None:
				// nop
				break;

			case TestingFramework.Vitest:
				devDependenciesObj.addPackage('vitest');
				break;
		}

		if (this.options.enablePrettier) {
			devDependenciesObj.addPackage('prettier');

			if (this.options.sortImports) {
				devDependenciesObj.addPackage(
					'@trivago/prettier-plugin-sort-imports',
				);
			}
		}

		if (this.options.enableESLint) {
			devDependenciesObj.addPackage('@typescript-eslint/eslint-plugin');
			devDependenciesObj.addPackage('@typescript-eslint/parser');
			devDependenciesObj.addPackage('eslint');
			devDependenciesObj.addPackage('eslint-plugin-import');
		}

		if (this.options.enablePrettier && this.options.enableESLint) {
			devDependenciesObj.addPackage('eslint-config-prettier');
			devDependenciesObj.addPackage('eslint-plugin-prettier');
		}

		if (this.options.configurePathAliases) {
			devDependenciesObj
				.addPackage('tsc-alias')
				.addPackage('concurrently');
		}

		const addAdditionalPackage = (
			name: keyof typeof dependencies,
		): void => {
			dependenciesObj.addPackage(name);
		};

		if (this.options.useAjv) {
			addAdditionalPackage('ajv');
		}

		if (this.options.useLodash) {
			addAdditionalPackage('lodash-es');
			devDependenciesObj.addPackage('@types/lodash-es');
		}

		if (this.options.useQs) {
			addAdditionalPackage('qs');
			devDependenciesObj.addPackage('@types/qs');
		}

		const scriptsObj = new JsonObject();
		if (this.options.configurePathAliases) {
			scriptsObj
				.addEntry('build', 'tsc && tsc-alias')
				.addEntry(
					'build:watch',
					'tsc && (concurrently \\"tsc -w\\" \\"tsc-alias -w\\")',
				);
		} else {
			scriptsObj.addEntry('build', 'tsc');
		}
		scriptsObj.addEntry('start', 'node dist/index.js');

		const rootObj = new JsonObject()
			.addEntry('name', this.options.projectName)
			.addEntry('version', '1.0.0')
			//.addEntry('description', '')
			//.addEntry('repository', '')
			//.addEntry('author', '')
			//.addEntry('license', '')
			.addEntry('private', true)
			.addEntry(
				'devDependencies',
				devDependenciesObj.entries.length > 0
					? devDependenciesObj.orderByKey()
					: undefined,
			)
			.addEntry(
				'dependencies',
				dependenciesObj.entries.length > 0
					? dependenciesObj.orderByKey()
					: undefined,
			)
			.addEntry('scripts', scriptsObj);

		return `${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	generateTSConfigJson = (): string => {
		const { tab, newLine } = this.editorConfig;

		const compilerOptionsObj = new JsonObject()
			.addEntry('target', 'es2016')
			.addEntry('module', 'commonjs')
			.addEntry('outDir', './dist')
			.addEntry('esModuleInterop', true)
			.addEntry('forceConsistentCasingInFileNames', true)
			.addEntry('strict', true)
			.addEntry('skipLibCheck', true);

		if (this.options.configurePathAliases) {
			compilerOptionsObj.addEntry('baseUrl', './');
			compilerOptionsObj.addEntry(
				'paths',
				new JsonObject().addEntry(
					'@/*',
					new JsonArray().addItem('src/*'),
				),
			);
		}

		const rootObj = new JsonObject().addEntry(
			'compilerOptions',
			compilerOptionsObj,
		);

		return `${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	generateSrcIndexTS = (): string => {
		const lines: string[] = [];
		lines.push("console.log('Hello, World!');");
		return this.joinLines(lines);
	};

	*generateProjectFiles(): Generator<ProjectFile> {
		yield* super.generateProjectFiles();

		yield {
			path: '.gitignore',
			text: new NodeGitignoreGenerator(this.editorConfig, {}).generate(),
		};

		yield {
			path: 'package.json',
			text: this.generatePackageJson(),
		};

		yield {
			path: 'tsconfig.json',
			text: this.generateTSConfigJson(),
		};

		yield {
			path: 'src/index.ts',
			text: this.generateSrcIndexTS(),
		};
	}
}
