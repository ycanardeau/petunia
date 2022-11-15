import { TypeScriptViteReactProject } from '@/core/projects/TypeScriptViteReactProject';
import { describe, expect, test } from 'vitest';

describe('TypeScriptViteReactProject', () => {
	test('generateGitignore', () => {
		const actual = TypeScriptViteReactProject.generateGitignore({
			tab: '\t',
			newLine: '\n',
		});
		expect(actual).toBe(`# Logs
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
`);
	});
});
