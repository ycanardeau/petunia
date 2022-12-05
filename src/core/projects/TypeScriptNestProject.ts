import {
	JavaScriptImports,
	JavaScriptNamedImport,
} from '@/core/JavaScriptImport';
import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { PackageJsonDependency } from '@/core/projects/PackageJsonDependency';
import { ProjectFile } from '@/core/projects/Project';
import {
	TestingFramework,
	TypeScriptProject,
	TypeScriptProjectOptions,
} from '@/core/projects/TypeScriptProject';
import dependencies from '@/core/projects/dependencies.json' assert { type: 'json' };
import validate from 'validate-npm-package-name';

type TypeScriptNestProjectOptions = TypeScriptProjectOptions;

export class TypeScriptNestProject extends TypeScriptProject<TypeScriptNestProjectOptions> {
	generateGitignore = (): string => {
		const lines: string[] = [];
		lines.push('# compiled output');
		lines.push('/dist');
		lines.push('/node_modules');
		lines.push('');
		lines.push('# Logs');
		lines.push('logs');
		lines.push('*.log');
		lines.push('npm-debug.log*');
		lines.push('pnpm-debug.log*');
		lines.push('yarn-debug.log*');
		lines.push('yarn-error.log*');
		lines.push('lerna-debug.log*');
		lines.push('');
		lines.push('# OS');
		lines.push('.DS_Store');
		lines.push('');
		lines.push('# Tests');
		lines.push('/coverage');
		lines.push('/.nyc_output');
		lines.push('');
		lines.push('# IDEs and editors');
		lines.push('/.idea');
		lines.push('.project');
		lines.push('.classpath');
		lines.push('.c9/');
		lines.push('*.launch');
		lines.push('.settings/');
		lines.push('*.sublime-workspace');
		lines.push('');
		lines.push('# IDE - VSCode');
		lines.push('.vscode/*');
		lines.push('!.vscode/settings.json');
		lines.push('!.vscode/tasks.json');
		lines.push('!.vscode/launch.json');
		lines.push('!.vscode/extensions.json');
		return this.joinLines(lines);
	};

	generatePackageJson = (): string => {
		if (this.options.projectName !== undefined) {
			const { validForNewPackages } = validate(this.options.projectName);
			if (!validForNewPackages) {
				throw new Error('Invalid project name');
			}
		}

		const { tab, newLine } = this.editorConfig;

		const devDependenciesObj = new PackageJsonDependency()
			.addPackage('@nestjs/cli')
			.addPackage('@nestjs/schematics')
			.addPackage('@nestjs/testing')
			.addPackage('@types/express')
			.addPackage('@types/node')
			.addPackage('@types/supertest')
			.addPackage('@typescript-eslint/eslint-plugin')
			.addPackage('@typescript-eslint/parser')
			.addPackage('eslint')
			.addPackage('eslint-config-prettier')
			.addPackage('eslint-plugin-prettier')
			.addPackage('prettier')
			.addPackage('source-map-support')
			.addPackage('supertest')
			.addPackage('ts-loader')
			.addPackage('ts-node')
			.addPackage('tsconfig-paths')
			.addPackage('typescript');

		const dependenciesObj = new PackageJsonDependency()
			.addPackage('@nestjs/common')
			.addPackage('@nestjs/core')
			.addPackage('@nestjs/platform-express')
			.addPackage('reflect-metadata')
			.addPackage('rimraf')
			.addPackage('rxjs');

		switch (this.options.test) {
			case TestingFramework.None:
				// nop
				break;

			case TestingFramework.Vitest:
				devDependenciesObj.addPackage('vitest');
				break;

			case TestingFramework.Jest:
				devDependenciesObj
					.addPackage('@types/jest')
					.addPackage('jest')
					.addPackage('ts-jest');
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

		const scriptsObj = new JsonObject()
			.addEntry('prebuild', 'rimraf dist')
			.addEntry('build', 'nest build')
			.addEntry(
				'format',
				`prettier --write \\"src/**/*.ts\\" \\"test/**/*.ts\\"`,
			)
			.addEntry('start', 'nest start')
			.addEntry('start:dev', 'nest start --watch')
			.addEntry('start:debug', 'nest start --debug --watch')
			.addEntry('start:prod', 'node dist/main')
			.addEntry(
				'lint',
				'eslint \\"{src,apps,libs,test}/**/*.ts\\" --fix',
			);

		switch (this.options.test) {
			case TestingFramework.Jest:
				scriptsObj
					.addEntry('test', 'jest')
					.addEntry('test:watch', 'jest --watch')
					.addEntry('test:cov', 'jest --coverage')
					.addEntry(
						'test:debug',
						'node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand',
					)
					.addEntry('test:e2e', 'jest --config ./test/jest-e2e.json');
				break;
		}

		const rootObj = new JsonObject()
			.addEntry('name', this.options.projectName)
			.addEntry('version', '0.0.1')
			.addEntry('description', '')
			//.addEntry('repository', '')
			.addEntry('author', '')
			.addEntry('private', true)
			.addEntry('license', 'UNLICENSED')
			.addEntry('scripts', scriptsObj)
			.addEntry(
				'dependencies',
				dependenciesObj.entries.length > 0
					? dependenciesObj.orderByKey()
					: undefined,
			)
			.addEntry(
				'devDependencies',
				devDependenciesObj.entries.length > 0
					? devDependenciesObj.orderByKey()
					: undefined,
			);

		if (this.options.test === TestingFramework.Jest) {
			rootObj.addEntry(
				'jest',
				new JsonObject()
					.addEntry(
						'moduleFileExtensions',
						new JsonArray()
							.addItem('js')
							.addItem('json')
							.addItem('ts'),
					)
					.addEntry('rootDir', 'src')
					.addEntry('testRegex', '.*\\.spec\\.ts$')
					.addEntry(
						'transform',
						new JsonObject().addEntry('^.+\\.(t|j)s$', 'ts-jest'),
					)
					.addEntry(
						'collectCoverageFrom',
						new JsonArray().addItem('**/*.(t|j)s'),
					)
					.addEntry('coverageDirectory', '../coverage')
					.addEntry('testEnvironment', 'node'),
			);
		}

		return `${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	generateTSConfigJson = (): string => {
		const { tab, newLine } = this.editorConfig;

		const compilerOptionsObj = new JsonObject()
			.addEntry('module', 'commonjs')
			.addEntry('declaration', true)
			.addEntry('removeComments', true)
			.addEntry('emitDecoratorMetadata', true)
			.addEntry('experimentalDecorators', true)
			.addEntry('allowSyntheticDefaultImports', true)
			.addEntry('target', 'es2017')
			.addEntry('sourceMap', true)
			.addEntry('outDir', './dist')
			.addEntry('baseUrl', './')
			.addEntry('incremental', true)
			.addEntry('skipLibCheck', true)
			.addEntry('strictNullChecks', true)
			.addEntry('noImplicitAny', true)
			.addEntry('strictBindCallApply', true)
			.addEntry('forceConsistentCasingInFileNames', true)
			.addEntry('noFallthroughCasesInSwitch', true);

		if (this.options.configurePathAliases) {
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

	generateTSConfigBuildJson = (): string => {
		const { tab, newLine } = this.editorConfig;

		const rootObj = new JsonObject()
			.addEntry('extends', './tsconfig.json')
			.addEntry(
				'exclude',
				new JsonArray()
					.addItem('node_modules')
					.addItem('test')
					.addItem('dist')
					.addItem('**/*spec.ts'),
			);

		return `${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	generateNestCliJson = (): string => {
		const { tab, newLine } = this.editorConfig;

		const rootObj = new JsonObject()
			.addEntry('$schema', 'https://json.schemastore.org/nest-cli')
			.addEntry('collection', '@nestjs/schematics')
			.addEntry('sourceRoot', 'src');

		return `${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	generateSrcAppControllerTS = (): string => {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports().addImport(
			new JavaScriptNamedImport('@nestjs/common')
				.addNamedExport('Controller')
				.addNamedExport('Get'),
		);

		const lines: string[] = [];
		lines.push(imports.toFormattedString({ newLine: newLine }));
		lines.push('');
		lines.push('@Controller()');
		lines.push('export class AppController {');
		lines.push(`${tab}@Get()`);
		lines.push(`${tab}getHello(): string {`);
		lines.push(`${tab}${tab}return 'Hello, World!';`);
		lines.push(`${tab}}`);
		lines.push('}');
		return this.joinLines(lines);
	};

	generateSrcAppModuleTS = (): string => {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports()
			.addImport(
				new JavaScriptNamedImport('@nestjs/common').addNamedExport(
					'Module',
				),
			)
			.addImport(
				new JavaScriptNamedImport(
					this.options.configurePathAliases
						? '@/AppController'
						: './AppController',
				).addNamedExport('AppController'),
			);

		const lines: string[] = [];
		lines.push(imports.toFormattedString({ newLine: newLine }));
		lines.push('');
		lines.push(
			`@Module(${new JsonObject()
				.addEntry('imports', new JsonArray())
				.addEntry(
					'controllers',
					new JsonArray().addItem(new JsonLiteral('AppController')),
				)
				.addEntry('providers', new JsonArray())
				.toFormattedString({
					tab: tab,
					newLine: newLine,
					style: 'JavaScript',
				})})`,
		);
		lines.push('export class AppModule {}');
		return this.joinLines(lines);
	};

	generateSrcMainTS = (): string => {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports()
			.addImport(
				new JavaScriptNamedImport('@nestjs/core').addNamedExport(
					'NestFactory',
				),
			)
			.addImport(
				new JavaScriptNamedImport(
					this.options.configurePathAliases
						? '@/AppModule'
						: './AppModule',
				).addNamedExport('AppModule'),
			);

		const lines: string[] = [];
		lines.push(imports.toFormattedString({ newLine: newLine }));
		lines.push('');
		lines.push('async function bootstrap(): Promise<void> {');
		lines.push(`${tab}const app = await NestFactory.create(AppModule);`);
		lines.push(`${tab}await app.listen(3000);`);
		lines.push('}');
		lines.push('bootstrap();');
		return this.joinLines(lines);
	};

	*generateProjectFiles(): Generator<ProjectFile> {
		yield* super.generateProjectFiles();

		yield { path: '.gitignore', text: this.generateGitignore() };
		yield { path: 'package.json', text: this.generatePackageJson() };
		yield { path: 'tsconfig.json', text: this.generateTSConfigJson() };
		yield {
			path: 'tsconfig.build.json',
			text: this.generateTSConfigBuildJson(),
		};
		yield {
			path: 'nest-cli.json',
			text: this.generateNestCliJson(),
		};

		yield {
			path: 'src/AppController.ts',
			text: this.generateSrcAppControllerTS(),
		};
		yield {
			path: 'src/AppModule.ts',
			text: this.generateSrcAppModuleTS(),
		};
		yield {
			path: 'src/main.ts',
			text: this.generateSrcMainTS(),
		};
	}
}
