import {
	TypeScriptProject,
	TypeScriptProjectOptions,
} from '@/features/typescript/projects/TypeScriptProject';
import { beforeAll, describe, expect, test } from 'vitest';

describe('TypeScriptProject', () => {
	class FakeTypeScriptProject extends TypeScriptProject<TypeScriptProjectOptions> {
		get isReactProject(): boolean {
			return false;
		}
	}

	let defaultProject: FakeTypeScriptProject;

	beforeAll(() => {
		defaultProject = new FakeTypeScriptProject(undefined, {});
	});

	test('generateProjectFiles', () => {
		const actual = Array.from(defaultProject.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = ['.editorconfig'];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles enablePrettier', () => {
		const project = new FakeTypeScriptProject(undefined, {
			enablePrettier: true,
		});
		const actual = Array.from(project.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = ['.editorconfig', '.prettierrc.json'];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles enableESLint', () => {
		const project = new FakeTypeScriptProject(undefined, {
			enableESLint: true,
		});
		const actual = Array.from(project.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = ['.editorconfig', '.eslintrc.cjs', 'eslint.config.js'];
		expect(actual).toEqual(expected);
	});
});
