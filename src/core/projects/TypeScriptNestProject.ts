import { JavaScriptImports } from '@/core/JavaScriptImport';
import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { OrmFramework } from '@/core/projects/OrmFramework';
import { PackageJsonDependency } from '@/core/projects/PackageJsonDependency';
import { ProjectFile } from '@/core/projects/Project';
import {
	TestingFramework,
	TypeScriptProject,
	TypeScriptProjectOptions,
} from '@/core/projects/TypeScriptProject';
import dependencies from '@/core/projects/dependencies.json' assert { type: 'json' };
import validate from 'validate-npm-package-name';

interface TypeScriptNestProjectOptions extends TypeScriptProjectOptions {
	orm?: OrmFramework;
}

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

		if (this.options.orm === OrmFramework.MikroOrm) {
			lines.push('');
			lines.push('.env.local');
			lines.push('.env.development.local');
			lines.push('.env.test.local');
			lines.push('.env.production.local');
			lines.push('/temp');
		}

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

		switch (this.options.orm) {
			case OrmFramework.None:
				// nop
				break;

			case OrmFramework.MikroOrm:
				devDependenciesObj
					.addPackage('cross-env')
					.addPackage('@mikro-orm/cli')
					.addPackage('@mikro-orm/migrations');
				dependenciesObj
					.addPackage('@mikro-orm/core')
					.addPackage('@mikro-orm/nestjs')
					.addPackage('@mikro-orm/reflection')
					.addPackage('@mikro-orm/sql-highlighter');
				switch (true /* TODO */) {
					case true /* TODO */:
						dependenciesObj.addPackage('@mikro-orm/mariadb');
						break;
				}
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

		switch (this.options.orm) {
			case OrmFramework.MikroOrm:
				scriptsObj
					.addEntry('prebuild', 'rimraf dist')
					.addEntry('build', 'nest build')
					.addEntry(
						'format',
						`prettier --write \\"src/**/*.ts\\" \\"test/**/*.ts\\"`,
					)
					.addEntry(
						'start',
						'cross-env MIKRO_ORM_ENV=.env.development.local nest start',
					)
					.addEntry(
						'start:dev',
						'cross-env MIKRO_ORM_ENV=.env.development.local nest start --watch',
					)
					.addEntry(
						'start:debug',
						'cross-env MIKRO_ORM_ENV=.env.development.local nest start --debug --watch',
					)
					.addEntry(
						'start:prod',
						'cross-env MIKRO_ORM_ENV=.env.production.local node dist/main',
					)
					.addEntry(
						'lint',
						'eslint \\"{src,apps,libs,test}/**/*.ts\\" --fix',
					);
				break;

			default:
				scriptsObj
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
				break;
		}

		switch (this.options.test) {
			case TestingFramework.Jest:
				switch (this.options.orm) {
					case OrmFramework.MikroOrm:
						scriptsObj
							.addEntry(
								'test',
								'cross-env MIKRO_ORM_ENV=.env.test.local jest',
							)
							.addEntry(
								'test:watch',
								'cross-env MIKRO_ORM_ENV=.env.test.local jest --watch',
							)
							.addEntry(
								'test:cov',
								'cross-env MIKRO_ORM_ENV=.env.test.local jest --coverage',
							)
							.addEntry(
								'test:debug',
								'cross-env MIKRO_ORM_ENV=.env.test.local node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand',
							)
							.addEntry(
								'test:e2e',
								'cross-env MIKRO_ORM_ENV=.env.test.local jest --config ./test/jest-e2e.json',
							);
						break;

					default:
						scriptsObj
							.addEntry('test', 'jest')
							.addEntry('test:watch', 'jest --watch')
							.addEntry('test:cov', 'jest --coverage')
							.addEntry(
								'test:debug',
								'node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand',
							)
							.addEntry(
								'test:e2e',
								'jest --config ./test/jest-e2e.json',
							);
						break;
				}
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

		if (this.options.orm === OrmFramework.MikroOrm) {
			rootObj.addEntry(
				'mikro-orm',
				new JsonObject()
					.addEntry('useTsNode', true)
					.addEntry(
						'configPaths',
						new JsonArray()
							.addItem('./src/mikro-orm.config.ts')
							.addItem('./dist/mikro-orm.config.js'),
					),
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
			.addEntry('strict', true)
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

		if (this.options.orm === OrmFramework.MikroOrm) {
			compilerOptionsObj.addEntry('esModuleInterop', true);
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

		const imports = new JavaScriptImports().addNamedImport(
			'@nestjs/common',
			(builder) =>
				builder.addNamedExport('Controller').addNamedExport('Get'),
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
			.addNamedImport('@nestjs/common', (builder) =>
				builder.addNamedExport('Module'),
			)
			.addNamedImport(
				this.options.configurePathAliases
					? '@/AppController'
					: './AppController',
				(builder) => builder.addNamedExport('AppController'),
			);

		if (this.options.orm === OrmFramework.MikroOrm) {
			imports.addNamedImport('@mikro-orm/nestjs', (builder) =>
				builder.addNamedExport('MikroOrmModule'),
			);
		}

		const importsArray = new JsonArray();
		if (this.options.orm === OrmFramework.MikroOrm) {
			importsArray.addItem(new JsonLiteral('MikroOrmModule.forRoot()'));
		}

		const lines: string[] = [];
		lines.push(imports.toFormattedString({ newLine: newLine }));
		lines.push('');
		lines.push(
			`@Module(${new JsonObject()
				.addEntry('imports', importsArray)
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
			.addNamedImport('@nestjs/core', (builder) =>
				builder.addNamedExport('NestFactory'),
			)
			.addNamedImport(
				this.options.configurePathAliases
					? '@/AppModule'
					: './AppModule',
				(builder) => builder.addNamedExport('AppModule'),
			);

		if (this.options.orm === OrmFramework.MikroOrm) {
			imports
				.addNamedImport('@mikro-orm/core', (builder) =>
					builder
						.addNamedExport('MikroORM')
						.addNamedExport('RequestContext'),
				)
				.addNamedImport('express', (builder) =>
					builder
						.addNamedExport('NextFunction')
						.addNamedExport('Request')
						.addNamedExport('Response'),
				);
		}

		const lines: string[] = [];
		lines.push(imports.toFormattedString({ newLine: newLine }));
		lines.push('');
		lines.push('async function bootstrap(): Promise<void> {');
		lines.push(`${tab}const app = await NestFactory.create(AppModule);`);
		if (this.options.orm === OrmFramework.MikroOrm) {
			lines.push('');
			lines.push(`${tab}const orm = app.get<MikroORM>(MikroORM);`);
			lines.push('');
			lines.push(
				`${tab}// https://mikro-orm.io/docs/identity-map#-requestcontext-helper`,
			);
			lines.push(
				`${tab}app.use((_request: Request, _response: Response, next: NextFunction) => {`,
			);
			lines.push(`${tab}${tab}RequestContext.create(orm.em, next);`);
			lines.push(`${tab}});`);
		}
		lines.push('');
		lines.push(`${tab}await app.listen(3000);`);
		lines.push('}');
		lines.push('bootstrap();');
		return this.joinLines(lines);
	};

	generateEnvLocal = (environment: string): string => {
		const lines: string[] = [];

		if (this.options.orm === OrmFramework.MikroOrm) {
			lines.push('MIKRO_ORM_TYPE =');
			lines.push('MIKRO_ORM_DB_NAME =');
			lines.push(
				`MIKRO_ORM_DEBUG = ${
					environment === 'development' || environment === 'test'
						? true
						: false
				}`,
			);
			lines.push('MIKRO_ORM_USER =');
			lines.push('MIKRO_ORM_PASSWORD =');
			lines.push('MIKRO_ORM_ENTITIES = ./dist/entities/**/*.js');
			lines.push('MIKRO_ORM_ENTITIES_TS = ./src/entities/**/*.ts');
			lines.push('MIKRO_ORM_MIGRATIONS_PATH = ./src/migrations');
			lines.push('MIKRO_ORM_MIGRATIONS_DISABLE_FOREIGN_KEYS = false');
			lines.push(
				'MIKRO_ORM_SCHEMA_GENERATOR_DISABLE_FOREIGN_KEYS = false',
			);
			lines.push('MIKRO_ORM_FORCE_UNDEFINED = true');
			lines.push('MIKRO_ORM_FORCE_UTC_TIMEZONE = true');
			lines.push(
				`MIKRO_ORM_ALLOW_GLOBAL_CONTEXT = ${
					environment === 'test' ? true : false
				}`,
			);
			lines.push('MIKRO_ORM_AUTO_JOIN_ONE_TO_ONE_OWNER = false');
		}

		return this.joinLines(lines);
	};

	generateSrcMikroOrmConfigTS = (): string => {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports()
			.addNamedImport('@mikro-orm/reflection', (builder) =>
				builder.addNamedExport('TsMorphMetadataProvider'),
			)
			.addNamedImport('@mikro-orm/sql-highlighter', (builder) =>
				builder.addNamedExport('SqlHighlighter'),
			)
			.addNamedImport('@nestjs/common', (builder) =>
				builder.addNamedExport('Logger'),
			);

		const lines: string[] = [];
		lines.push(imports.toFormattedString({ newLine: newLine }));
		lines.push('');
		lines.push("const logger = new Logger('MikroORM');");
		lines.push('');
		lines.push(
			`export default ${new JsonObject()
				.addEntry(
					'highlighter',
					new JsonLiteral('new SqlHighlighter()'),
				)
				.addEntry('logger', new JsonLiteral('logger.log.bind(logger)'))
				.addEntry(
					'metadataProvider',
					new JsonLiteral('TsMorphMetadataProvider'),
				)
				.toFormattedString({
					tab: tab,
					newLine: newLine,
					style: 'JavaScript',
				})};`,
		);
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

		switch (this.options.orm) {
			case OrmFramework.MikroOrm:
				yield {
					path: '.env.development.local',
					text: this.generateEnvLocal('development'),
				};
				yield {
					path: '.env.production.local',
					text: this.generateEnvLocal('production'),
				};
				yield {
					path: '.env.test.local',
					text: this.generateEnvLocal('test'),
				};
				yield {
					path: 'src/mikro-orm.config.ts',
					text: this.generateSrcMikroOrmConfigTS(),
				};
				break;
		}
	}
}
