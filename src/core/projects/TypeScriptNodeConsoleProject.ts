import { JavaScriptImports } from '@/core/JavaScriptImport';
import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { NodeGitignoreGenerator } from '@/core/projects/NodeGitignoreGenerator';
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

interface TypeScriptNodeConsoleProjectOptions extends TypeScriptProjectOptions {
	orm?: OrmFramework;
}

export class TypeScriptNodeConsoleProject extends TypeScriptProject<TypeScriptNodeConsoleProjectOptions> {
	generatePackageJson(): string {
		if (this.options.projectName !== undefined) {
			const { validForNewPackages } = validate(this.options.projectName);
			if (!validForNewPackages) {
				throw new Error('Invalid project name');
			}
		}

		const { tab, newLine } = this.editorConfig;

		const devDependenciesObj = new PackageJsonDependency()
			.addPackage('typescript')
			.addPackage('rimraf');

		const dependenciesObj = new PackageJsonDependency();

		switch (this.options.test) {
			case TestingFramework.None:
				// nop
				break;

			case TestingFramework.Vitest:
				devDependenciesObj.addPackage('vitest');
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
					//.addPackage('@mikro-orm/nestjs')
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

		if (this.options.configurePathAliases) {
			scriptsObj
				.addEntry('clean', 'rimraf ./dist')
				.addEntry('build', 'npm run clean && tsc && tsc-alias')
				.addEntry(
					'build:watch',
					'npm run clean && tsc && (concurrently \\"tsc -w\\" \\"tsc-alias -w\\")',
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
	}

	generateTSConfigJson(): string {
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

		if (this.options.orm === OrmFramework.MikroOrm) {
			compilerOptionsObj.addEntry('esModuleInterop', true);
		}

		return `${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	}

	generateSrcIndexTS(): string {
		const lines: string[] = [];
		lines.push("console.log('Hello, World!');");
		return this.joinLines(lines);
	}

	generateEnvLocal(environment: string): string {
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
	}

	generateSrcMikroOrmConfigTS(): string {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports()
			.addNamedImport('@mikro-orm/core', (builder) =>
				builder.addNamedExport('Options'),
			)
			.addNamedImport('@mikro-orm/reflection', (builder) =>
				builder.addNamedExport('TsMorphMetadataProvider'),
			)
			.addNamedImport('@mikro-orm/sql-highlighter', (builder) =>
				builder.addNamedExport('SqlHighlighter'),
			);
		/*.addNamedImport('@nestjs/common', (builder) =>
				builder.addNamedExport('Logger'),
			);*/

		const lines: string[] = [];
		lines.push(imports.toFormattedString({ newLine: newLine }));
		//lines.push('');
		//lines.push("const logger = new Logger('MikroORM');");
		lines.push('');
		lines.push(
			`const options: Options = ${new JsonObject()
				.addEntry(
					'highlighter',
					new JsonLiteral('new SqlHighlighter()'),
				)
				//.addEntry('logger', new JsonLiteral('logger.log.bind(logger)'))
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
		lines.push('');
		lines.push('export default options;');
		return this.joinLines(lines);
	}

	*generateProjectFiles(): Generator<ProjectFile> {
		yield* super.generateProjectFiles();

		yield {
			path: '.gitignore',
			text: new NodeGitignoreGenerator(
				this.editorConfig,
				this.options,
			).generate(),
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
