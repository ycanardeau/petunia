using Aigamo.Petunia.Projects;

namespace Aigamo.Petunia.Tests.Projects;

public sealed class TypeScriptViteReactProjectTests
{
	[Fact]
	public void GenerateGitignore()
	{
		TypeScriptViteReactProject.GenerateGitignore().Should().Be("""
			# Logs
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
			
			""");
	}

	[Fact]
	public void GeneratePackageJson()
	{
		TypeScriptViteReactProject.GeneratePackageJson().Should().Be("""
			{
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

			""");
	}

	[Fact]
	public void GenerateTSConfigJson()
	{
		TypeScriptViteReactProject.GenerateTSConfigJson().Should().Be("""
			{
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
			
			""");
	}

	[Fact]
	public void GenerateTSConfigNodeJson()
	{
		TypeScriptViteReactProject.GenerateTSConfigNodeJson().Should().Be("""
			{
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
			
			""");
	}

	[Fact]
	public void GenerateESLintRcJS()
	{
		TypeScriptViteReactProject.GenerateESLintRcJS().Should().Be("""
			module.exports = {
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
					'react-app',
					'react-app/jest',
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
			
			""");
	}

	[Fact]
	public void GenerateIndexHtml()
	{
		TypeScriptViteReactProject.GenerateIndexHtml().Should().Be("""
			<!DOCTYPE html>
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
			
			""");
	}

	[Fact]
	public void GenerateViteConfigTS()
	{
		TypeScriptViteReactProject.GenerateViteConfigTS().Should().Be("""
			import react from '@vitejs/plugin-react';
			import { defineConfig } from 'vite';
			
			// https://vitejs.dev/config/
			export default defineConfig({
				plugins: [react()],
			});
			
			""");
	}

	[Fact]
	public void GenerateSrcAppTsx()
	{
		TypeScriptViteReactProject.GenerateSrcAppTsx().Should().Be("""
			import React from 'react';
			
			const App = (): React.ReactElement => {
				return <></>;
			};
			
			export default App;
			
			""");
	}

	[Fact]
	public void GenerateSrcMainTsx()
	{
		TypeScriptViteReactProject.GenerateSrcMainTsx().Should().Be("""
			import App from './App';
			import React from 'react';
			import ReactDOM from 'react-dom/client';

			ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
				<React.StrictMode>
					<App />
				</React.StrictMode>,
			);
			
			""");
	}

	[Fact]
	public void GenerateSrcViteEnvDTS()
	{
		TypeScriptViteReactProject.GenerateSrcViteEnvDTS().Should().Be("""
			/// <reference types="vite/client" />
			
			""");
	}

	[Fact]
	public void GenerateProjectFiles()
	{
		var project = new TypeScriptViteReactProject(new());
		var projectFiles = project.GenerateProjectFiles();
		ProjectFile? SingleOrDefault(string path) => projectFiles.SingleOrDefault(projectFile => projectFile.Path == path);
		SingleOrDefault(".editorconfig").Should().NotBeNull();
		SingleOrDefault(".prettierrc.json").Should().NotBeNull();
		SingleOrDefault(".gitignore").Should().NotBeNull();
		SingleOrDefault("package.json").Should().NotBeNull();
		SingleOrDefault("tsconfig.json").Should().NotBeNull();
		SingleOrDefault("tsconfig.node.json").Should().NotBeNull();
		// TODO: SingleOrDefault(".eslintrc.js").Should().NotBeNull();
		SingleOrDefault("index.html").Should().NotBeNull();
		SingleOrDefault("src/App.tsx").Should().NotBeNull();
		SingleOrDefault("src/main.tsx").Should().NotBeNull();
		SingleOrDefault("src/vite-env.d.ts").Should().NotBeNull();
	}
}
