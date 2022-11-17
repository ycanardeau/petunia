import { TypeScriptViteReactProject } from '@/core/projects/TypeScriptViteReactProject';
import { expect, test } from 'vitest';

const defaultEditorConfig = {
	tab: '\t',
	newLine: '\n',
};

test('generateEditorConfig', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateEditorConfig();
	const expected = `root = true

[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
indent_style = tab
indent_size = 4
`;
	expect(actual).toBe(expected);
});

test('generatePrettierRcJson', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generatePrettierRcJson();
	const expected = `{
	"singleQuote": true,
	"trailingComma": "all",
	"importOrder": [
		"^@core/(.*)$",
		"^@server/(.*)$",
		"^@ui/(.*)$",
		"^[./]"
	],
	"importOrderSeparation": true,
	"importOrderSortSpecifiers": true
}
`;
	expect(actual).toBe(expected);
});

test('generateGitignore', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateGitignore();
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

test('generatePackageJson', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generatePackageJson();
	const expected = `{
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
`;
	expect(actual).toBe(expected);
});

test('generateTSConfigJson', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateTSConfigJson();
	const expected = `{
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
`;
	expect(actual).toBe(expected);
});

test('generateTSConfigNodeJson', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateTSConfigNodeJson();
	const expected = `{
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
`;
	expect(actual).toBe(expected);
});

test('generateESLintRcJS', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateESLintRcJS();
	const expected = `module.exports = {
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
`;
	expect(actual).toBe(expected);
});

test('generateIndexHtml', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateIndexHtml();
	const expected = `<!DOCTYPE html>
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
`;
	expect(actual).toBe(expected);
});

test('generateViteConfigTS', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateViteConfigTS();
	const expected = `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
	],
});
`;
	expect(actual).toBe(expected);
});

test('generateSrcAppTsx', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateSrcAppTsx();
	const expected = `import React from 'react';

const App = (): React.ReactElement => {
	return <></>;
};

export default App;
`;
	expect(actual).toBe(expected);
});

test('generateSrcMainTsx', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateSrcMainTsx();
	const expected = `import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
`;
	expect(actual).toBe(expected);
});

test('generateSrcViteEnvDTS', () => {
	const project = new TypeScriptViteReactProject(defaultEditorConfig, {});
	const actual = project.generateSrcViteEnvDTS();
	const expected = `/// <reference types="vite/client" />
`;
	expect(actual).toBe(expected);
});
