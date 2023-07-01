import { OrmFramework } from '@/core/projects/OrmFramework';
import { TypeScriptNodeConsoleProject } from '@/core/projects/TypeScriptNodeConsoleProject';
import dependencies from '@/core/projects/dependencies.json' assert { type: 'json' };
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

	test('generatePackageJson MikroORM', () => {
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
		"@mikro-orm/core": "^5.7.12",
		"@mikro-orm/mariadb": "^5.7.12",
		"@mikro-orm/reflection": "^5.7.12",
		"@mikro-orm/sql-highlighter": "^1.0.1"
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

	test('generateTSConfigOrmJson MikroORM', () => {
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

	test('generateProjectFiles MikroORM', () => {
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
			'.env.development.local',
			'.env.production.local',
			'.env.test.local',
			'src/mikro-orm.config.ts',
		];
		expect(actual).toEqual(expected);
	});
});
