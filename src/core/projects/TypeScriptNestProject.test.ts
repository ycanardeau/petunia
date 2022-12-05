import { TypeScriptNestProject } from '@/core/projects/TypeScriptNestProject';
import { TestingFramework } from '@/core/projects/TypeScriptProject';
import dependencies from '@/core/projects/dependencies.json' assert { type: 'json' };
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
		"@nestjs/common": "^9.0.0",
		"@nestjs/core": "^9.0.0",
		"@nestjs/platform-express": "^9.0.0",
		"reflect-metadata": "^0.1.13",
		"rimraf": "^3.0.2",
		"rxjs": "^7.2.0"
	},
	"devDependencies": {
		"@nestjs/cli": "^9.0.0",
		"@nestjs/schematics": "^9.0.0",
		"@nestjs/testing": "^9.0.0",
		"@types/express": "^4.17.13",
		"@types/node": "^16.0.0",
		"@types/supertest": "^2.0.11",
		"@typescript-eslint/eslint-plugin": "${dependencies['@typescript-eslint/eslint-plugin']}",
		"@typescript-eslint/parser": "${dependencies['@typescript-eslint/parser']}",
		"eslint": "${dependencies['eslint']}",
		"eslint-config-prettier": "${dependencies['eslint-config-prettier']}",
		"eslint-plugin-prettier": "${dependencies['eslint-plugin-prettier']}",
		"prettier": "${dependencies['prettier']}",
		"source-map-support": "^0.5.20",
		"supertest": "^6.1.3",
		"ts-loader": "^9.2.3",
		"ts-node": "^10.0.0",
		"tsconfig-paths": "^4.1.0",
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
		"@nestjs/common": "^9.0.0",
		"@nestjs/core": "^9.0.0",
		"@nestjs/platform-express": "^9.0.0",
		"reflect-metadata": "^0.1.13",
		"rimraf": "^3.0.2",
		"rxjs": "^7.2.0"
	},
	"devDependencies": {
		"@nestjs/cli": "^9.0.0",
		"@nestjs/schematics": "^9.0.0",
		"@nestjs/testing": "^9.0.0",
		"@types/express": "^4.17.13",
		"@types/jest": "^28.1.8",
		"@types/node": "^16.0.0",
		"@types/supertest": "^2.0.11",
		"@typescript-eslint/eslint-plugin": "${dependencies['@typescript-eslint/eslint-plugin']}",
		"@typescript-eslint/parser": "${dependencies['@typescript-eslint/parser']}",
		"eslint": "${dependencies['eslint']}",
		"eslint-config-prettier": "${dependencies['eslint-config-prettier']}",
		"eslint-plugin-prettier": "${dependencies['eslint-plugin-prettier']}",
		"jest": "^28.1.3",
		"prettier": "${dependencies['prettier']}",
		"source-map-support": "^0.5.20",
		"supertest": "^6.1.3",
		"ts-jest": "^28.0.8",
		"ts-loader": "^9.2.3",
		"ts-node": "^10.0.0",
		"tsconfig-paths": "^4.1.0",
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
		"strictNullChecks": true,
		"noImplicitAny": true,
		"strictBindCallApply": true,
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
		"strictNullChecks": true,
		"noImplicitAny": true,
		"strictBindCallApply": true,
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
});
