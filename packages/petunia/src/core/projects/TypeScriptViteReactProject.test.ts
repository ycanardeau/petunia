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

	test('generatePackageJson', () => {
		const actual = TypeScriptViteReactProject.generatePackageJson({
			tab: '\t',
			newLine: '\n',
		});
		expect(actual).toBe(`{
	"name": "petunia",
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@vitejs/plugin-react": "^2.2.0",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
	}
}
`);
	});
});
