import { TypeScriptViteReactProject } from '@/core/projects/TypeScriptViteReactProject';
import { expect, test } from 'vitest';

const defaultEditorConfig = {
	tab: '\t',
	newLine: '\n',
};

test('generateGitignore', () => {
	const actual =
		TypeScriptViteReactProject.generateGitignore(defaultEditorConfig);
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
	const actual =
		TypeScriptViteReactProject.generatePackageJson(defaultEditorConfig);
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

test('generateTSConfigJson', () => {
	const actual =
		TypeScriptViteReactProject.generateTSConfigJson(defaultEditorConfig);
	expect(actual).toBe(`{
	"compilerOptions": {
		"target": "ESNext",
		"useDefineForClassFields": true,
		"lib": [
			"DOM",
			"DOM.Iterable",
			"ESNext"
		],
		"allowJs": false,
		"skipLibCheck": true,
		"esModuleInterop": false,
		"allowSyntheticDefaultImports": true,
		"strict": true,
		"forceConsistentCasingInFileNames": true,
		"module": "ESNext",
		"moduleResolution": "Node",
		"resolveJsonModule": true,
		"isolatedModules": true,
		"noEmit": true,
		"jsx": "react-jsx"
	},
	"include": [
		"src"
	],
	"references": [
		{
			"path": "./tsconfig.node.json"
		}
	]
}
`);
});

test('generateTSConfigNodeJson', () => {
	const actual =
		TypeScriptViteReactProject.generateTSConfigNodeJson(
			defaultEditorConfig,
		);
	expect(actual).toBe(`{
	"compilerOptions": {
		"composite": true,
		"module": "ESNext",
		"moduleResolution": "Node",
		"allowSyntheticDefaultImports": true
	},
	"include": [
		"vite.config.ts"
	]
}
`);
});

test('generateIndexHtml', () => {
	const actual =
		TypeScriptViteReactProject.generateIndexHtml(defaultEditorConfig);
	expect(actual).toBe(`<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title></title>
	</head>
	<body>
		<div id="root"></div>
		<script type="module" src="/src/main.tsx"></script>
	</body>
</html>
`);
});

test('generateViteConfigTS', () => {
	const actual =
		TypeScriptViteReactProject.generateViteConfigTS(defaultEditorConfig);
	expect(actual).toBe(`import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
});
`);
});

test('generateSrcAppTsx', () => {
	const actual =
		TypeScriptViteReactProject.generateSrcAppTsx(defaultEditorConfig);
	expect(actual).toBe(`import React from 'react';

const App = (): React.ReactElement => {
	return <></>;
};

export default App;
`);
});
