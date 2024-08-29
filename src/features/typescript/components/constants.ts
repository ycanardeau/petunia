import { TestingFramework } from '@/features/typescript/projects/TypeScriptProject';

export const testingFrameworkNames: Record<TestingFramework, string> = {
	[TestingFramework.None]: 'None',
	[TestingFramework.Vitest]: 'Vitest',
	[TestingFramework.Jest]: 'Jest',
};
