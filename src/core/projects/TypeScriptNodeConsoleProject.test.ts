import { TypeScriptNodeConsoleProject } from '@/core/projects/TypeScriptNodeConsoleProject';
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

	test('generateProjectFiles', () => {
		const actual = Array.from(defaultProject.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = ['.editorconfig', '.gitignore'];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles enablePrettier', () => {
		const project = new TypeScriptNodeConsoleProject(undefined, {
			enablePrettier: true,
		});
		const actual = Array.from(project.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = ['.editorconfig', '.prettierrc.json', '.gitignore'];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles enableESLint', () => {
		const project = new TypeScriptNodeConsoleProject(undefined, {
			enableESLint: true,
		});
		const actual = Array.from(project.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = ['.editorconfig', '.eslintrc.cjs', '.gitignore'];
		expect(actual).toEqual(expected);
	});
});
