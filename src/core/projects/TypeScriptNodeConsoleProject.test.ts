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
});
