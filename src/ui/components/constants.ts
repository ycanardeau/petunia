import { TestingFramework } from '@/core/projects/TypeScriptProject';

export const testingFrameworkNames: Record<TestingFramework, string> = {
	[TestingFramework.None]: 'None',
	[TestingFramework.Vitest]: 'Vitest',
};
