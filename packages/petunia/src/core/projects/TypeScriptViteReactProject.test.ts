import { TypeScriptViteReactProject } from '@/core/projects/TypeScriptViteReactProject';
import { expect, test } from 'vitest';

const defaultEditorConfig = {
	tab: '\t',
	newLine: '\n',
};

test('generateGitignore', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateGitignore();
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
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generatePackageJson();
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
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateTSConfigJson();
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
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateTSConfigNodeJson();
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

test('generateESLintRcJS', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateESLintRcJS();
	expect(actual).toBe(`module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
	},
	plugins: [
		'@typescript-eslint/eslint-plugin',
	],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [
		'.eslintrc.js',
	],
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-function': 'off',
	},
};
`);
});

test('generateIndexHtml', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateIndexHtml();
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
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateViteConfigTS();
	expect(actual).toBe(`import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
});
`);
});

test('generateSrcAppTsx', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateSrcAppTsx();
	expect(actual).toBe(`import React from 'react';

const App = (): React.ReactElement => {
	return <></>;
};

export default App;
`);
});

test('generateSrcMainTsx', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateSrcMainTsx();
	expect(actual).toBe(`import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
`);
});

test('generateSrcViteEnvDTS', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateSrcViteEnvDTS();
	expect(actual).toBe(`/// <reference types="vite/client" />
`);
});
