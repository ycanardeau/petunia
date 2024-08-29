import { OrmFramework } from '@/features/typescript/projects/OrmFramework';
import { PackageManager } from '@/features/typescript/projects/PackageManager';
import { TypeScriptNodeConsoleProject } from '@/features/typescript/projects/TypeScriptNodeConsoleProject';
import dependencies from '@/features/typescript/projects/dependencies.json' assert { type: 'json' };
import { beforeAll, describe, expect, test } from 'vitest';

describe('TypeScriptNodeConsoleProject', () => {
	let defaultProject: TypeScriptNodeConsoleProject;

	beforeAll(() => {
		defaultProject = new TypeScriptNodeConsoleProject(undefined, {});
	});

	test('isReactProject', () => {
		const actual = defaultProject.isReactProject;
		expect(actual).toBe(false);
	});

	test('generatePackageJson', () => {
		const actual = defaultProject.generatePackageJson();
		const expected = `{
	"version": "1.0.0",
	"private": true,
	"devDependencies": {
		"rimraf": "${dependencies['rimraf']}",
		"typescript": "${dependencies['typescript']}"
	},
	"scripts": {
		"build": "tsc",
		"start": "node dist/index.js"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson configurePathAliases', () => {
		const project = new TypeScriptNodeConsoleProject(undefined, {
			configurePathAliases: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"version": "1.0.0",
	"private": true,
	"devDependencies": {
		"concurrently": "${dependencies['concurrently']}",
		"rimraf": "${dependencies['rimraf']}",
		"tsc-alias": "${dependencies['tsc-alias']}",
		"typescript": "${dependencies['typescript']}"
	},
	"scripts": {
		"clean": "rimraf ./dist",
		"build": "npm run clean && tsc && tsc-alias",
		"build:watch": "npm run clean && tsc && (concurrently \\"tsc -w\\" \\"tsc-alias -w\\")",
		"start": "node dist/index.js"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson configurePathAliases packageManager Pnpm', () => {
		const project = new TypeScriptNodeConsoleProject(undefined, {
			configurePathAliases: true,
			packageManager: PackageManager.Pnpm,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"version": "1.0.0",
	"private": true,
	"devDependencies": {
		"concurrently": "${dependencies['concurrently']}",
		"rimraf": "${dependencies['rimraf']}",
		"tsc-alias": "${dependencies['tsc-alias']}",
		"typescript": "${dependencies['typescript']}"
	},
	"scripts": {
		"clean": "rimraf ./dist",
		"build": "pnpm clean && tsc && tsc-alias",
		"build:watch": "pnpm clean && tsc && (concurrently \\"tsc -w\\" \\"tsc-alias -w\\")",
		"start": "node dist/index.js"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson orm MikroORM', () => {
		const project = new TypeScriptNodeConsoleProject(undefined, {
			orm: OrmFramework.MikroOrm,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"version": "1.0.0",
	"private": true,
	"devDependencies": {
		"@mikro-orm/cli": "${dependencies['@mikro-orm/cli']}",
		"@mikro-orm/migrations": "${dependencies['@mikro-orm/migrations']}",
		"cross-env": "${dependencies['cross-env']}",
		"rimraf": "${dependencies['rimraf']}",
		"ts-node": "${dependencies['ts-node']}",
		"typescript": "${dependencies['typescript']}"
	},
	"dependencies": {
		"@mikro-orm/core": "${dependencies['@mikro-orm/core']}",
		"@mikro-orm/mysql": "${dependencies['@mikro-orm/mysql']}",
		"@mikro-orm/reflection": "${dependencies['@mikro-orm/reflection']}",
		"@mikro-orm/sql-highlighter": "${dependencies['@mikro-orm/sql-highlighter']}"
	},
	"scripts": {
		"build": "tsc",
		"start": "node dist/index.js"
	},
	"mikro-orm": {
		"useTsNode": true,
		"tsConfigPath": "./tsconfig.orm.json",
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
		"target": "es2016",
		"module": "commonjs",
		"outDir": "./dist",
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"strict": true,
		"skipLibCheck": true
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generateTSConfigJson MikroOrm', () => {
		const project = new TypeScriptNodeConsoleProject(undefined, {
			orm: OrmFramework.MikroOrm,
		});
		const actual = project.generateTSConfigJson();
		const expected = `{
	"compilerOptions": {
		"target": "es2016",
		"module": "commonjs",
		"outDir": "./dist",
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"strict": true,
		"skipLibCheck": true,
		"experimentalDecorators": true,
		"emitDecoratorMetadata": true,
		"declaration": true
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generateTSConfigOrmJson orm MikroORM', () => {
		const project = new TypeScriptNodeConsoleProject(undefined, {
			orm: OrmFramework.MikroOrm,
		});
		const actual = project.generateTSConfigOrmJson();
		const expected = `{
	"extends": "./tsconfig.json",
	"compilerOptions": {
		"module": "commonjs"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generateSrcIndexTS', () => {
		const actual = defaultProject.generateSrcIndexTS();
		const expected = `console.log('Hello, World!');
`;
		expect(actual).toBe(expected);
	});

	test('generateDockerfile', () => {
		const actual = defaultProject.generateDockerfile();
		const expected = `FROM node:20-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY . .
RUN npm ci

EXPOSE 5000

CMD ["npm", "start"]
`;
		expect(actual).toBe(expected);
	});

	test('generateDockerfile packageManager Pnpm', () => {
		const project = new TypeScriptNodeConsoleProject(undefined, {
			packageManager: PackageManager.Pnpm,
		});
		const actual = project.generateDockerfile();
		const expected = `FROM node:20-alpine as build

WORKDIR /app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:20-alpine

WORKDIR /app

RUN npm i -g pnpm

COPY --from=build /app/dist /app/dist
COPY . .
RUN pnpm install --frozen-lockfile

EXPOSE 5000

CMD ["pnpm", "start"]
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
			'src/index.ts',
		];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles enablePrettier', () => {
		const project = new TypeScriptNodeConsoleProject(undefined, {
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
			'src/index.ts',
		];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles enableESLint', () => {
		const project = new TypeScriptNodeConsoleProject(undefined, {
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
			'src/index.ts',
		];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles orm MikroORM', () => {
		const project = new TypeScriptNodeConsoleProject(undefined, {
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
			'tsconfig.orm.json',
			'src/index.ts',
			'.env.development.local.example',
			'.env.production.local.example',
			'.env.test.local.example',
			'src/mikro-orm.config.ts',
		];
		expect(actual).toEqual(expected);
	});
});
