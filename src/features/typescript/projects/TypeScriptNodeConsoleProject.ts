import { JavaScriptImports } from '@/core/JavaScriptImport';
import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { ProjectFile } from '@/features/common/projects/Project';
import { Database } from '@/features/typescript/projects/Database';
import { NodeGitignoreGenerator } from '@/features/typescript/projects/NodeGitignoreGenerator';
import { OrmFramework } from '@/features/typescript/projects/OrmFramework';
import { PackageJsonDependency } from '@/features/typescript/projects/PackageJsonDependency';
import { PackageManager } from '@/features/typescript/projects/PackageManager';
import {
	TestingFramework,
	TypeScriptProject,
	TypeScriptProjectOptions,
} from '@/features/typescript/projects/TypeScriptProject';
import dependencies from '@/features/typescript/projects/dependencies.json' assert { type: 'json' };
import validate from 'validate-npm-package-name';

export interface TypeScriptNodeConsoleProjectOptions
	extends TypeScriptProjectOptions {
	orm?: OrmFramework;
	database?: Database;
	useYohira?: boolean;
	useBcrypt?: boolean;
	generateDockerfile?: boolean;
}

export class TypeScriptNodeConsoleProject extends TypeScriptProject<TypeScriptNodeConsoleProjectOptions> {
	getMikroOrmDriverPackage():
		| '@mikro-orm/mysql'
		| '@mikro-orm/postgresql'
		| '@mikro-orm/mariadb' {
		switch (this.options.database) {
			case Database.MySql:
			default:
				return '@mikro-orm/mysql';

			case Database.PostgreSql:
				return '@mikro-orm/postgresql';

			case Database.MariaDb:
				return '@mikro-orm/mariadb';
		}
	}

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
					.addPackage('@mikro-orm/migrations')
					.addPackage('ts-node');
				dependenciesObj
					.addPackage('@mikro-orm/core')
					//.addPackage('@mikro-orm/nestjs')
					.addPackage('@mikro-orm/reflection')
					.addPackage('@mikro-orm/sql-highlighter')
					.addPackage(this.getMikroOrmDriverPackage());
				break;
		}

		if (this.options.enablePrettier) {
			devDependenciesObj.addPackage('prettier');

			if (this.options.sortImports) {
				devDependenciesObj.addPackage(
					'eslint-plugin-simple-import-sort',
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

		if (this.options.useYohira) {
			addAdditionalPackage('yohira');
		}

		if (this.options.useBcrypt) {
			addAdditionalPackage('bcryptjs');
			devDependenciesObj.addPackage('@types/bcryptjs');
		}

		const scriptsObj = new JsonObject();

		if (this.options.configurePathAliases) {
			scriptsObj.addEntry('clean', 'rimraf ./dist');

			switch (this.options.packageManager) {
				case PackageManager.Npm:
				default:
					scriptsObj
						.addEntry('build', 'npm run clean && tsc && tsc-alias')
						.addEntry(
							'build:watch',
							'npm run clean && tsc && (concurrently \\"tsc -w\\" \\"tsc-alias -w\\")',
						);
					break;

				case PackageManager.Pnpm:
					scriptsObj
						.addEntry('build', 'pnpm clean && tsc && tsc-alias')
						.addEntry(
							'build:watch',
							'pnpm clean && tsc && (concurrently \\"tsc -w\\" \\"tsc-alias -w\\")',
						);
					break;
			}
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
					.addEntry('tsConfigPath', './tsconfig.orm.json')
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

		if (this.options.orm === OrmFramework.MikroOrm) {
			compilerOptionsObj
				.addEntry('experimentalDecorators', true)
				.addEntry('emitDecoratorMetadata', true)
				.addEntry('declaration', true);
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
	}

	generateTSConfigOrmJson(): string {
		const { tab, newLine } = this.editorConfig;

		const compilerOptionsObj = new JsonObject().addEntry(
			'module',
			'commonjs',
		);

		const rootObj = new JsonObject()
			.addEntry('extends', './tsconfig.json')
			.addEntry('compilerOptions', compilerOptionsObj);

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
			lines.push('MIKRO_ORM_HOST =');
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
			lines.push(
				`MIKRO_ORM_ALLOW_GLOBAL_CONTEXT = ${
					environment === 'test' ? true : false
				}`,
			);
		}

		return this.joinLines(lines);
	}

	generateSrcMikroOrmConfigTS(): string {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports()
			.addNamedImport(this.getMikroOrmDriverPackage(), (builder) =>
				builder.addNamedExport('defineConfig'),
			)
			.addNamedImport('@mikro-orm/reflection', (builder) =>
				builder.addNamedExport('TsMorphMetadataProvider'),
			)
			.addNamedImport('@mikro-orm/sql-highlighter', (builder) =>
				builder.addNamedExport('SqlHighlighter'),
			)
			.addNamedImport('@mikro-orm/migrations', (builder) =>
				builder.addNamedExport('Migrator'),
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
			`export default defineConfig(${new JsonObject()
				.addEntry(
					'highlighter',
					new JsonLiteral('new SqlHighlighter()'),
				)
				//.addEntry('logger', new JsonLiteral('logger.log.bind(logger)'))
				.addEntry(
					'metadataProvider',
					new JsonLiteral('TsMorphMetadataProvider'),
				)
				.addEntry(
					'migrations',
					new JsonObject()
						.addEntry('snapshotName', '.snapshot')
						.addEntry('path', './dist/migrations')
						.addEntry('pathTs', './src/migrations')
						.addEntry('disableForeignKeys', false),
				)
				.addEntry(
					'schemaGenerator',
					new JsonObject().addEntry('disableForeignKeys', false),
				)
				.addEntry(
					'entities',
					new JsonArray().addItem('./dist/entities/**/*.js'),
				)
				.addEntry(
					'entitiesTs',
					new JsonArray().addItem('./src/entities/**/*.ts'),
				)
				.addEntry('forceUndefined', true)
				.addEntry('forceUtcTimezone', true)
				.addEntry('allowGlobalContext', false)
				.addEntry('autoJoinOneToOneOwner', false)
				.addEntry(
					'extensions',
					new JsonArray().addItem(new JsonLiteral('Migrator')),
				)
				.toFormattedString({
					tab: tab,
					newLine: newLine,
					style: 'JavaScript',
				})});`,
		);
		return this.joinLines(lines);
	}

	generateDockerfile(): string {
		const lines: string[] = [];

		lines.push('FROM node:20-alpine as build');

		lines.push('');
		lines.push('WORKDIR /app');

		if (this.options.packageManager === PackageManager.Pnpm) {
			lines.push('');
			lines.push('RUN npm i -g pnpm');
		}

		switch (this.options.packageManager) {
			case PackageManager.Npm:
			default:
				lines.push('');
				lines.push('COPY package.json package-lock.json ./');
				lines.push('RUN npm ci');
				break;

			case PackageManager.Pnpm:
				lines.push('');
				lines.push('COPY package.json pnpm-lock.yaml ./');
				lines.push('RUN pnpm install --frozen-lockfile');
				break;
		}

		lines.push('');
		lines.push('COPY . .');

		switch (this.options.packageManager) {
			case PackageManager.Npm:
			default:
				lines.push('RUN npm run build');
				break;

			case PackageManager.Pnpm:
				lines.push('RUN pnpm build');
				break;
		}

		lines.push('');
		lines.push('FROM node:20-alpine');

		lines.push('');
		lines.push('WORKDIR /app');

		if (this.options.packageManager === PackageManager.Pnpm) {
			lines.push('');
			lines.push('RUN npm i -g pnpm');
		}

		lines.push('');
		lines.push('COPY --from=build /app/dist /app/dist');
		lines.push('COPY . .');

		switch (this.options.packageManager) {
			case PackageManager.Npm:
			default:
				lines.push('RUN npm ci');
				break;

			case PackageManager.Pnpm:
				lines.push('RUN pnpm install --frozen-lockfile');
				break;
		}

		lines.push('');
		lines.push('EXPOSE 5000');

		switch (this.options.packageManager) {
			case PackageManager.Npm:
			default:
				lines.push('');
				lines.push('CMD ["npm", "start"]');
				break;

			case PackageManager.Pnpm:
				lines.push('');
				lines.push('CMD ["pnpm", "start"]');
				break;
		}

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

		if (this.options.orm === OrmFramework.MikroOrm) {
			yield {
				path: 'tsconfig.orm.json',
				text: this.generateTSConfigOrmJson(),
			};
		}

		yield {
			path: 'src/index.ts',
			text: this.generateSrcIndexTS(),
		};

		switch (this.options.orm) {
			case OrmFramework.MikroOrm:
				yield {
					path: '.env.development.local.example',
					text: this.generateEnvLocal('development'),
				};
				yield {
					path: '.env.production.local.example',
					text: this.generateEnvLocal('production'),
				};
				yield {
					path: '.env.test.local.example',
					text: this.generateEnvLocal('test'),
				};
				yield {
					path: 'src/mikro-orm.config.ts',
					text: this.generateSrcMikroOrmConfigTS(),
				};
				break;
		}

		if (this.options.generateDockerfile) {
			yield {
				path: 'Dockerfile',
				text: this.generateDockerfile(),
			};
			yield {
				path: '.dockerignore',
				text: new NodeGitignoreGenerator(
					this.editorConfig,
					this.options,
				).generate(),
			};
		}
	}
}
