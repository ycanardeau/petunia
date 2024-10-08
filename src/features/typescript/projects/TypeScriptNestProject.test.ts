import dependencies from '@/features/common/projects/dependencies.json' assert { type: 'json' };
import { OrmFramework } from '@/features/typescript/projects/OrmFramework';
import { TypeScriptNestProject } from '@/features/typescript/projects/TypeScriptNestProject';
import { TestingFramework } from '@/features/typescript/projects/TypeScriptProject';
import { beforeAll, describe, expect, test } from 'vitest';

describe('TypeScriptNestProject', () => {
	let defaultProject: TypeScriptNestProject;

	beforeAll(() => {
		defaultProject = new TypeScriptNestProject(undefined, {});
	});

	test('generateGitignore', () => {
		const actual = defaultProject.generateGitignore();
		const expected = `# compiled output
/dist
/node_modules

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
`;
		expect(actual).toBe(expected);
	});

	test('generateGitignore orm MikroOrm', () => {
		const project = new TypeScriptNestProject(undefined, {
			orm: OrmFramework.MikroOrm,
		});
		const actual = project.generateGitignore();
		const expected = `# compiled output
/dist
/node_modules

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

.env.local
.env.development.local
.env.test.local
.env.production.local
/temp
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson', () => {
		const actual = defaultProject.generatePackageJson();
		const expected = `{
	"version": "0.0.1",
	"description": "",
	"author": "",
	"private": true,
	"license": "UNLICENSED",
	"scripts": {
		"prebuild": "rimraf dist",
		"build": "nest build",
		"format": "prettier --write \\"src/**/*.ts\\" \\"test/**/*.ts\\"",
		"start": "nest start",
		"start:dev": "nest start --watch",
		"start:debug": "nest start --debug --watch",
		"start:prod": "node dist/main",
		"lint": "eslint \\"{src,apps,libs,test}/**/*.ts\\" --fix"
	},
	"dependencies": {
		"@nestjs/common": "${dependencies['@nestjs/common']}",
		"@nestjs/core": "${dependencies['@nestjs/core']}",
		"@nestjs/platform-express": "${dependencies['@nestjs/platform-express']}",
		"reflect-metadata": "${dependencies['reflect-metadata']}",
		"rimraf": "${dependencies['rimraf']}",
		"rxjs": "${dependencies['rxjs']}"
	},
	"devDependencies": {
		"@nestjs/cli": "${dependencies['@nestjs/cli']}",
		"@nestjs/schematics": "${dependencies['@nestjs/schematics']}",
		"@nestjs/testing": "${dependencies['@nestjs/testing']}",
		"@types/express": "${dependencies['@types/express']}",
		"@types/node": "${dependencies['@types/node']}",
		"@types/supertest": "${dependencies['@types/supertest']}",
		"source-map-support": "${dependencies['source-map-support']}",
		"supertest": "${dependencies['supertest']}",
		"ts-loader": "${dependencies['ts-loader']}",
		"ts-node": "${dependencies['ts-node']}",
		"tsconfig-paths": "${dependencies['tsconfig-paths']}",
		"typescript": "${dependencies['typescript']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson test Jest', () => {
		const project = new TypeScriptNestProject(undefined, {
			test: TestingFramework.Jest,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"version": "0.0.1",
	"description": "",
	"author": "",
	"private": true,
	"license": "UNLICENSED",
	"scripts": {
		"prebuild": "rimraf dist",
		"build": "nest build",
		"format": "prettier --write \\"src/**/*.ts\\" \\"test/**/*.ts\\"",
		"start": "nest start",
		"start:dev": "nest start --watch",
		"start:debug": "nest start --debug --watch",
		"start:prod": "node dist/main",
		"lint": "eslint \\"{src,apps,libs,test}/**/*.ts\\" --fix",
		"test": "jest",
		"test:watch": "jest --watch",
		"test:cov": "jest --coverage",
		"test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
		"test:e2e": "jest --config ./test/jest-e2e.json"
	},
	"dependencies": {
		"@nestjs/common": "${dependencies['@nestjs/common']}",
		"@nestjs/core": "${dependencies['@nestjs/core']}",
		"@nestjs/platform-express": "${dependencies['@nestjs/platform-express']}",
		"reflect-metadata": "${dependencies['reflect-metadata']}",
		"rimraf": "${dependencies['rimraf']}",
		"rxjs": "${dependencies['rxjs']}"
	},
	"devDependencies": {
		"@nestjs/cli": "${dependencies['@nestjs/cli']}",
		"@nestjs/schematics": "${dependencies['@nestjs/schematics']}",
		"@nestjs/testing": "${dependencies['@nestjs/testing']}",
		"@types/express": "${dependencies['@types/express']}",
		"@types/jest": "${dependencies['@types/jest']}",
		"@types/node": "${dependencies['@types/node']}",
		"@types/supertest": "${dependencies['@types/supertest']}",
		"jest": "${dependencies['jest']}",
		"source-map-support": "${dependencies['source-map-support']}",
		"supertest": "${dependencies['supertest']}",
		"ts-jest": "${dependencies['ts-jest']}",
		"ts-loader": "${dependencies['ts-loader']}",
		"ts-node": "${dependencies['ts-node']}",
		"tsconfig-paths": "${dependencies['tsconfig-paths']}",
		"typescript": "${dependencies['typescript']}"
	},
	"jest": {
		"moduleFileExtensions": [
			"js",
			"json",
			"ts"
		],
		"rootDir": "src",
		"testRegex": ".*\\.spec\\.ts$",
		"transform": {
			"^.+\\.(t|j)s$": "ts-jest"
		},
		"collectCoverageFrom": [
			"**/*.(t|j)s"
		],
		"coverageDirectory": "../coverage",
		"testEnvironment": "node"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson orm MikroOrm', () => {
		const project = new TypeScriptNestProject(undefined, {
			orm: OrmFramework.MikroOrm,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"version": "0.0.1",
	"description": "",
	"author": "",
	"private": true,
	"license": "UNLICENSED",
	"scripts": {
		"prebuild": "rimraf dist",
		"build": "nest build",
		"format": "prettier --write \\"src/**/*.ts\\" \\"test/**/*.ts\\"",
		"start": "cross-env MIKRO_ORM_ENV=.env.development.local nest start",
		"start:dev": "cross-env MIKRO_ORM_ENV=.env.development.local nest start --watch",
		"start:debug": "cross-env MIKRO_ORM_ENV=.env.development.local nest start --debug --watch",
		"start:prod": "cross-env MIKRO_ORM_ENV=.env.production.local node dist/main",
		"lint": "eslint \\"{src,apps,libs,test}/**/*.ts\\" --fix"
	},
	"dependencies": {
		"@mikro-orm/core": "${dependencies['@mikro-orm/core']}",
		"@mikro-orm/mariadb": "${dependencies['@mikro-orm/mariadb']}",
		"@mikro-orm/nestjs": "${dependencies['@mikro-orm/nestjs']}",
		"@mikro-orm/reflection": "${dependencies['@mikro-orm/reflection']}",
		"@mikro-orm/sql-highlighter": "${dependencies['@mikro-orm/sql-highlighter']}",
		"@nestjs/common": "${dependencies['@nestjs/common']}",
		"@nestjs/core": "${dependencies['@nestjs/core']}",
		"@nestjs/platform-express": "${dependencies['@nestjs/platform-express']}",
		"reflect-metadata": "${dependencies['reflect-metadata']}",
		"rimraf": "${dependencies['rimraf']}",
		"rxjs": "${dependencies['rxjs']}"
	},
	"devDependencies": {
		"@mikro-orm/cli": "${dependencies['@mikro-orm/cli']}",
		"@mikro-orm/migrations": "${dependencies['@mikro-orm/migrations']}",
		"@nestjs/cli": "${dependencies['@nestjs/cli']}",
		"@nestjs/schematics": "${dependencies['@nestjs/schematics']}",
		"@nestjs/testing": "${dependencies['@nestjs/testing']}",
		"@types/express": "${dependencies['@types/express']}",
		"@types/node": "${dependencies['@types/node']}",
		"@types/supertest": "${dependencies['@types/supertest']}",
		"cross-env": "${dependencies['cross-env']}",
		"source-map-support": "${dependencies['source-map-support']}",
		"supertest": "${dependencies['supertest']}",
		"ts-loader": "${dependencies['ts-loader']}",
		"ts-node": "${dependencies['ts-node']}",
		"tsconfig-paths": "${dependencies['tsconfig-paths']}",
		"typescript": "${dependencies['typescript']}"
	},
	"mikro-orm": {
		"useTsNode": true,
		"configPaths": [
			"./src/mikro-orm.config.ts",
			"./dist/mikro-orm.config.js"
		]
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson orm MikroOrm test Jest', () => {
		const project = new TypeScriptNestProject(undefined, {
			orm: OrmFramework.MikroOrm,
			test: TestingFramework.Jest,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"version": "0.0.1",
	"description": "",
	"author": "",
	"private": true,
	"license": "UNLICENSED",
	"scripts": {
		"prebuild": "rimraf dist",
		"build": "nest build",
		"format": "prettier --write \\"src/**/*.ts\\" \\"test/**/*.ts\\"",
		"start": "cross-env MIKRO_ORM_ENV=.env.development.local nest start",
		"start:dev": "cross-env MIKRO_ORM_ENV=.env.development.local nest start --watch",
		"start:debug": "cross-env MIKRO_ORM_ENV=.env.development.local nest start --debug --watch",
		"start:prod": "cross-env MIKRO_ORM_ENV=.env.production.local node dist/main",
		"lint": "eslint \\"{src,apps,libs,test}/**/*.ts\\" --fix",
		"test": "cross-env MIKRO_ORM_ENV=.env.test.local jest",
		"test:watch": "cross-env MIKRO_ORM_ENV=.env.test.local jest --watch",
		"test:cov": "cross-env MIKRO_ORM_ENV=.env.test.local jest --coverage",
		"test:debug": "cross-env MIKRO_ORM_ENV=.env.test.local node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
		"test:e2e": "cross-env MIKRO_ORM_ENV=.env.test.local jest --config ./test/jest-e2e.json"
	},
	"dependencies": {
		"@mikro-orm/core": "${dependencies['@mikro-orm/core']}",
		"@mikro-orm/mariadb": "${dependencies['@mikro-orm/mariadb']}",
		"@mikro-orm/nestjs": "${dependencies['@mikro-orm/nestjs']}",
		"@mikro-orm/reflection": "${dependencies['@mikro-orm/reflection']}",
		"@mikro-orm/sql-highlighter": "${dependencies['@mikro-orm/sql-highlighter']}",
		"@nestjs/common": "${dependencies['@nestjs/common']}",
		"@nestjs/core": "${dependencies['@nestjs/core']}",
		"@nestjs/platform-express": "${dependencies['@nestjs/platform-express']}",
		"reflect-metadata": "${dependencies['reflect-metadata']}",
		"rimraf": "${dependencies['rimraf']}",
		"rxjs": "${dependencies['rxjs']}"
	},
	"devDependencies": {
		"@mikro-orm/cli": "${dependencies['@mikro-orm/cli']}",
		"@mikro-orm/migrations": "${dependencies['@mikro-orm/migrations']}",
		"@nestjs/cli": "${dependencies['@nestjs/cli']}",
		"@nestjs/schematics": "${dependencies['@nestjs/schematics']}",
		"@nestjs/testing": "${dependencies['@nestjs/testing']}",
		"@types/express": "${dependencies['@types/express']}",
		"@types/jest": "${dependencies['@types/jest']}",
		"@types/node": "${dependencies['@types/node']}",
		"@types/supertest": "${dependencies['@types/supertest']}",
		"cross-env": "${dependencies['cross-env']}",
		"jest": "${dependencies['jest']}",
		"source-map-support": "${dependencies['source-map-support']}",
		"supertest": "${dependencies['supertest']}",
		"ts-jest": "${dependencies['ts-jest']}",
		"ts-loader": "${dependencies['ts-loader']}",
		"ts-node": "${dependencies['ts-node']}",
		"tsconfig-paths": "${dependencies['tsconfig-paths']}",
		"typescript": "${dependencies['typescript']}"
	},
	"jest": {
		"moduleFileExtensions": [
			"js",
			"json",
			"ts"
		],
		"rootDir": "src",
		"testRegex": ".*\\.spec\\.ts$",
		"transform": {
			"^.+\\.(t|j)s$": "ts-jest"
		},
		"collectCoverageFrom": [
			"**/*.(t|j)s"
		],
		"coverageDirectory": "../coverage",
		"testEnvironment": "node"
	},
	"mikro-orm": {
		"useTsNode": true,
		"configPaths": [
			"./src/mikro-orm.config.ts",
			"./dist/mikro-orm.config.js"
		]
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generateTSConfigJson', () => {
		const actual = defaultProject.generateTSConfigJson();
		const expected = `{
	"compilerOptions": {
		"module": "commonjs",
		"declaration": true,
		"removeComments": true,
		"emitDecoratorMetadata": true,
		"experimentalDecorators": true,
		"allowSyntheticDefaultImports": true,
		"target": "es2017",
		"sourceMap": true,
		"outDir": "./dist",
		"baseUrl": "./",
		"incremental": true,
		"skipLibCheck": true,
		"strict": true,
		"forceConsistentCasingInFileNames": true,
		"noFallthroughCasesInSwitch": true
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generateTSConfigJson configurePathAliases', () => {
		const project = new TypeScriptNestProject(undefined, {
			configurePathAliases: true,
		});
		const actual = project.generateTSConfigJson();
		const expected = `{
	"compilerOptions": {
		"module": "commonjs",
		"declaration": true,
		"removeComments": true,
		"emitDecoratorMetadata": true,
		"experimentalDecorators": true,
		"allowSyntheticDefaultImports": true,
		"target": "es2017",
		"sourceMap": true,
		"outDir": "./dist",
		"baseUrl": "./",
		"incremental": true,
		"skipLibCheck": true,
		"strict": true,
		"forceConsistentCasingInFileNames": true,
		"noFallthroughCasesInSwitch": true,
		"paths": {
			"@/*": [
				"src/*"
			]
		}
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generateTSConfigJson orm MikroOrm', () => {
		const project = new TypeScriptNestProject(undefined, {
			orm: OrmFramework.MikroOrm,
		});
		const actual = project.generateTSConfigJson();
		const expected = `{
	"compilerOptions": {
		"module": "commonjs",
		"declaration": true,
		"removeComments": true,
		"emitDecoratorMetadata": true,
		"experimentalDecorators": true,
		"allowSyntheticDefaultImports": true,
		"target": "es2017",
		"sourceMap": true,
		"outDir": "./dist",
		"baseUrl": "./",
		"incremental": true,
		"skipLibCheck": true,
		"strict": true,
		"forceConsistentCasingInFileNames": true,
		"noFallthroughCasesInSwitch": true,
		"esModuleInterop": true
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generateTSConfigBuildJson', () => {
		const actual = defaultProject.generateTSConfigBuildJson();
		const expected = `{
	"extends": "./tsconfig.json",
	"exclude": [
		"node_modules",
		"test",
		"dist",
		"**/*spec.ts"
	]
}
`;
		expect(actual).toBe(expected);
	});

	test('generateNestCliJson', () => {
		const actual = defaultProject.generateNestCliJson();
		const expected = `{
	"$schema": "https://json.schemastore.org/nest-cli",
	"collection": "@nestjs/schematics",
	"sourceRoot": "src"
}
`;
		expect(actual).toBe(expected);
	});

	test('generateSrcAppControllerTS', () => {
		const actual = defaultProject.generateSrcAppControllerTS();
		const expected = `import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
	@Get()
	getHello(): string {
		return 'Hello, World!';
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generateSrcAppModuleTS', () => {
		const actual = defaultProject.generateSrcAppModuleTS();
		const expected = `import { AppController } from './AppController';
import { Module } from '@nestjs/common';

@Module({
	imports: [],
	controllers: [
		AppController,
	],
	providers: [],
})
export class AppModule {}
`;
		expect(actual).toBe(expected);
	});

	test('generateSrcAppModuleTS configurePathAliases', () => {
		const project = new TypeScriptNestProject(undefined, {
			configurePathAliases: true,
		});
		const actual = project.generateSrcAppModuleTS();
		const expected = `import { AppController } from '@/AppController';
import { Module } from '@nestjs/common';

@Module({
	imports: [],
	controllers: [
		AppController,
	],
	providers: [],
})
export class AppModule {}
`;
		expect(actual).toBe(expected);
	});

	test('generateSrcAppModuleTS orm MikroOrm', () => {
		const project = new TypeScriptNestProject(undefined, {
			orm: OrmFramework.MikroOrm,
		});
		const actual = project.generateSrcAppModuleTS();
		const expected = `import { AppController } from './AppController';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

@Module({
	imports: [
		MikroOrmModule.forRoot(),
	],
	controllers: [
		AppController,
	],
	providers: [],
})
export class AppModule {}
`;
		expect(actual).toBe(expected);
	});

	test('generateSrcMainTS', () => {
		const actual = defaultProject.generateSrcMainTS();
		const expected = `import { AppModule } from './AppModule';
import { NestFactory } from '@nestjs/core';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	await app.listen(3000);
}
bootstrap();
`;
		expect(actual).toBe(expected);
	});

	test('generateSrcMainTS configurePathAliases', () => {
		const project = new TypeScriptNestProject(undefined, {
			configurePathAliases: true,
		});
		const actual = project.generateSrcMainTS();
		const expected = `import { AppModule } from '@/AppModule';
import { NestFactory } from '@nestjs/core';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	await app.listen(3000);
}
bootstrap();
`;
		expect(actual).toBe(expected);
	});

	test('generateSrcMainTS orm MikroOrm', () => {
		const project = new TypeScriptNestProject(undefined, {
			orm: OrmFramework.MikroOrm,
		});
		const actual = project.generateSrcMainTS();
		const expected = `import { AppModule } from './AppModule';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { NestFactory } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	const orm = app.get<MikroORM>(MikroORM);

	// https://mikro-orm.io/docs/identity-map#-requestcontext-helper
	app.use((_request: Request, _response: Response, next: NextFunction) => {
		RequestContext.create(orm.em, next);
	});

	await app.listen(3000);
}
bootstrap();
`;
		expect(actual).toBe(expected);
	});

	test('generateEnvLocal orm MikroOrm development', () => {
		const project = new TypeScriptNestProject(undefined, {
			orm: OrmFramework.MikroOrm,
		});
		const actual = project.generateEnvLocal('development');
		const expected = `MIKRO_ORM_TYPE =
MIKRO_ORM_DB_NAME =
MIKRO_ORM_DEBUG = true
MIKRO_ORM_USER =
MIKRO_ORM_PASSWORD =
MIKRO_ORM_ENTITIES = ./dist/entities/**/*.js
MIKRO_ORM_ENTITIES_TS = ./src/entities/**/*.ts
MIKRO_ORM_MIGRATIONS_PATH = ./src/migrations
MIKRO_ORM_MIGRATIONS_DISABLE_FOREIGN_KEYS = false
MIKRO_ORM_SCHEMA_GENERATOR_DISABLE_FOREIGN_KEYS = false
MIKRO_ORM_FORCE_UNDEFINED = true
MIKRO_ORM_FORCE_UTC_TIMEZONE = true
MIKRO_ORM_ALLOW_GLOBAL_CONTEXT = false
MIKRO_ORM_AUTO_JOIN_ONE_TO_ONE_OWNER = false
`;
		expect(actual).toBe(expected);
	});

	test('generateEnvLocal orm MikroOrm production', () => {
		const project = new TypeScriptNestProject(undefined, {
			orm: OrmFramework.MikroOrm,
		});
		const actual = project.generateEnvLocal('production');
		const expected = `MIKRO_ORM_TYPE =
MIKRO_ORM_DB_NAME =
MIKRO_ORM_DEBUG = false
MIKRO_ORM_USER =
MIKRO_ORM_PASSWORD =
MIKRO_ORM_ENTITIES = ./dist/entities/**/*.js
MIKRO_ORM_ENTITIES_TS = ./src/entities/**/*.ts
MIKRO_ORM_MIGRATIONS_PATH = ./src/migrations
MIKRO_ORM_MIGRATIONS_DISABLE_FOREIGN_KEYS = false
MIKRO_ORM_SCHEMA_GENERATOR_DISABLE_FOREIGN_KEYS = false
MIKRO_ORM_FORCE_UNDEFINED = true
MIKRO_ORM_FORCE_UTC_TIMEZONE = true
MIKRO_ORM_ALLOW_GLOBAL_CONTEXT = false
MIKRO_ORM_AUTO_JOIN_ONE_TO_ONE_OWNER = false
`;
		expect(actual).toBe(expected);
	});

	test('generateEnvLocal orm MikroOrm test', () => {
		const project = new TypeScriptNestProject(undefined, {
			orm: OrmFramework.MikroOrm,
		});
		const actual = project.generateEnvLocal('test');
		const expected = `MIKRO_ORM_TYPE =
MIKRO_ORM_DB_NAME =
MIKRO_ORM_DEBUG = true
MIKRO_ORM_USER =
MIKRO_ORM_PASSWORD =
MIKRO_ORM_ENTITIES = ./dist/entities/**/*.js
MIKRO_ORM_ENTITIES_TS = ./src/entities/**/*.ts
MIKRO_ORM_MIGRATIONS_PATH = ./src/migrations
MIKRO_ORM_MIGRATIONS_DISABLE_FOREIGN_KEYS = false
MIKRO_ORM_SCHEMA_GENERATOR_DISABLE_FOREIGN_KEYS = false
MIKRO_ORM_FORCE_UNDEFINED = true
MIKRO_ORM_FORCE_UTC_TIMEZONE = true
MIKRO_ORM_ALLOW_GLOBAL_CONTEXT = true
MIKRO_ORM_AUTO_JOIN_ONE_TO_ONE_OWNER = false
`;
		expect(actual).toBe(expected);
	});

	test('generateSrcMikroOrmConfigTS orm MikroOrm', () => {
		const project = new TypeScriptNestProject(undefined, {
			orm: OrmFramework.MikroOrm,
		});
		const actual = project.generateSrcMikroOrmConfigTS();
		const expected = `import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger } from '@nestjs/common';

const logger = new Logger('MikroORM');

export default {
	highlighter: new SqlHighlighter(),
	logger: logger.log.bind(logger),
	metadataProvider: TsMorphMetadataProvider,
};
`;
		expect(actual).toBe(expected);
	});

	test('generateProjectFiles', () => {
		const actual = Array.from(defaultProject.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = [
			'.editorconfig',
			'.gitignore',
			'package.json',
			'tsconfig.json',
			'tsconfig.build.json',
			'nest-cli.json',
			'src/AppController.ts',
			'src/AppModule.ts',
			'src/main.ts',
		];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles enablePrettier', () => {
		const project = new TypeScriptNestProject(undefined, {
			enablePrettier: true,
		});
		const actual = Array.from(project.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = [
			'.editorconfig',
			'.prettierrc.json',
			'.gitignore',
			'package.json',
			'tsconfig.json',
			'tsconfig.build.json',
			'nest-cli.json',
			'src/AppController.ts',
			'src/AppModule.ts',
			'src/main.ts',
		];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles enableESLint', () => {
		const project = new TypeScriptNestProject(undefined, {
			enableESLint: true,
		});
		const actual = Array.from(project.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = [
			'.editorconfig',
			'.eslintrc.cjs',
			'.gitignore',
			'package.json',
			'tsconfig.json',
			'tsconfig.build.json',
			'nest-cli.json',
			'src/AppController.ts',
			'src/AppModule.ts',
			'src/main.ts',
		];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles orm MikroOrm', () => {
		const project = new TypeScriptNestProject(undefined, {
			orm: OrmFramework.MikroOrm,
		});
		const actual = Array.from(project.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = [
			'.editorconfig',
			'.gitignore',
			'package.json',
			'tsconfig.json',
			'tsconfig.build.json',
			'nest-cli.json',
			'src/AppController.ts',
			'src/AppModule.ts',
			'src/main.ts',
			'.env.development.local.example',
			'.env.production.local.example',
			'.env.test.local.example',
			'src/mikro-orm.config.ts',
		];
		expect(actual).toEqual(expected);
	});
});
