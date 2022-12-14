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
		"tsc-alias": "${dependencies['tsc-alias']}",
		"typescript": "${dependencies['typescript']}"
	},
	"scripts": {
		"build": "tsc && tsc-alias",
		"build:watch": "tsc && (concurrently \\"tsc -w\\" \\"tsc-alias -w\\")",
		"start": "node dist/index.js"
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
});
