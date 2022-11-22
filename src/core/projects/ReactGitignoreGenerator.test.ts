import { ReactGitignoreGenerator } from '@/core/projects/ReactGitignoreGenerator';
import { describe, expect, test } from 'vitest';

describe('ReactGitignoreGenerator', () => {
	test('generate', () => {
		const actual = new ReactGitignoreGenerator().generate();
		const expected = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;
		expect(actual).toBe(expected);
	});
});
