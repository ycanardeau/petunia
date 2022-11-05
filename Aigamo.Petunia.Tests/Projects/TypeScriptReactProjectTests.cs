using Aigamo.Petunia.Projects;

namespace Aigamo.Petunia.Tests.Projects;

public sealed class TypeScriptReactProjectTests
{
	[Fact]
	public void GenerateGitignore()
	{
		TypeScriptReactProject.GenerateGitignore().Should().Be("""
			# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

			# dependencies
			/node_modules
			/.pnp
			.pnp.js

			# testing
			/coverage

			# production
			/build

			# misc
			.DS_Store
			.env.local
			.env.development.local
			.env.test.local
			.env.production.local

			npm-debug.log*
			yarn-debug.log*
			yarn-error.log*
			
			""");
	}

	[Fact]
	public void GeneratePackageJson()
	{
		TypeScriptReactProject.GeneratePackageJson().Should().Be("""
			{
				"name": "petunia",
				"version": "0.1.0",
				"private": true,
				"dependencies": {
					"@testing-library/jest-dom": "^5.14.1",
					"@testing-library/react": "^13.0.0",
					"@testing-library/user-event": "^13.2.1",
					"@types/jest": "^27.0.1",
					"@types/node": "^16.7.13",
					"@types/react": "^18.0.0",
					"@types/react-dom": "^18.0.0",
					"react": "^18.2.0",
					"react-dom": "^18.2.0",
					"react-scripts": "5.0.1",
					"typescript": "^4.4.2",
					"web-vitals": "^2.1.0"
				},
				"scripts": {
					"start": "react-scripts start",
					"build": "react-scripts build",
					"test": "react-scripts test",
					"eject": "react-scripts eject"
				},
				"eslintConfig": {
					"extends": [
						"react-app",
						"react-app/jest"
					]
				},
				"browserslist": {
					"production": [
						">0.2%",
						"not dead",
						"not op_mini all"
					],
					"development": [
						"last 1 chrome version",
						"last 1 firefox version",
						"last 1 safari version"
					]
				}
			}

			""");
	}

	[Fact]
	public void GenerateTSConfigJson()
	{
		TypeScriptReactProject.GenerateTSConfigJson().Should().Be("""
			{
				"compilerOptions": {
					"target": "es5",
					"lib": [
						"dom",
						"dom.iterable",
						"esnext"
					],
					"allowJs": true,
					"skipLibCheck": true,
					"esModuleInterop": true,
					"allowSyntheticDefaultImports": true,
					"strict": true,
					"forceConsistentCasingInFileNames": true,
					"noFallthroughCasesInSwitch": true,
					"module": "esnext",
					"moduleResolution": "node",
					"resolveJsonModule": true,
					"isolatedModules": true,
					"noEmit": true,
					"jsx": "react-jsx"
				},
				"include": [
					"src"
				]
			}
			
			""");
	}

	[Fact]
	public void GenerateESLintRcJS()
	{
		TypeScriptReactProject.GenerateESLintRcJS().Should().Be("""
			module.exports = {
				parser: '@typescript-eslint/parser',
				parserOptions: {
					project: 'tsconfig.json',
					sourceType: 'module',
					tsconfigRootDir: __dirname,
				},
				plugins: ['@typescript-eslint/eslint-plugin'],
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
				ignorePatterns: ['.eslintrc.js'],
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
	public void GeneratePublicIndexHtml()
	{
		TypeScriptReactProject.GeneratePublicIndexHtml().Should().Be("""
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="theme-color" content="#000000" />
					<meta name="description" content="" />
					<title></title>
				</head>
				<body>
					<noscript>You need to enable JavaScript to run this app.</noscript>
					<div id="root"></div>
				</body>
			</html>

			""");
	}

	[Fact]
	public void GenerateSrcAppTsx()
	{
		TypeScriptReactProject.GenerateSrcAppTsx().Should().Be("""
			import React from 'react';
			
			const App = (): React.ReactElement => {
				return <></>;
			};
			
			export default App;
			
			""");
	}

	[Fact]
	public void GenerateSrcReportWebVitalsTS()
	{
		TypeScriptReactProject.GenerateSrcReportWebVitalsTS().Should().Be("""
			import { ReportHandler } from 'web-vitals';

			const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
				if (onPerfEntry && onPerfEntry instanceof Function) {
					import('web-vitals').then(
						({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
							getCLS(onPerfEntry);
							getFID(onPerfEntry);
							getFCP(onPerfEntry);
							getLCP(onPerfEntry);
							getTTFB(onPerfEntry);
						},
					);
				}
			};

			export default reportWebVitals;
			
			""");
	}

	[Fact]
	public void GenerateSrcIndexTsx()
	{
		TypeScriptReactProject.GenerateSrcIndexTsx().Should().Be("""
			import App from './App';
			import reportWebVitals from './reportWebVitals';
			import React from 'react';
			import ReactDOM from 'react-dom/client';
			
			const root = ReactDOM.createRoot(
				document.getElementById('root') as HTMLElement,
			);
			root.render(
				<React.StrictMode>
					<App />
				</React.StrictMode>,
			);
			
			// If you want to start measuring performance in your app, pass a function
			// to log results (for example: reportWebVitals(console.log))
			// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
			reportWebVitals();
			
			""");
	}

	[Fact]
	public void GenerateSrcReactAppEnvDTS()
	{
		TypeScriptReactProject.GenerateSrcReactAppEnvDTS().Should().Be("""
			/// <reference types="react-scripts" />
			
			""");
	}

	[Fact]
	public void GenerateProjectFiles()
	{
		var project = new TypeScriptReactProject(new());
		var projectFiles = project.GenerateProjectFiles();
		ProjectFile? SingleOrDefault(string path) => projectFiles.SingleOrDefault(projectFile => projectFile.Path == path);
		SingleOrDefault(".editorconfig").Should().NotBeNull();
		SingleOrDefault(".prettierrc.json").Should().NotBeNull();
		SingleOrDefault(".gitignore").Should().NotBeNull();
		SingleOrDefault("package.json").Should().NotBeNull();
		SingleOrDefault("tsconfig.json").Should().NotBeNull();
		// TODO: SingleOrDefault(".eslintrc.js").Should().NotBeNull();
		SingleOrDefault("public/index.html").Should().NotBeNull();
		SingleOrDefault("src/App.tsx").Should().NotBeNull();
		SingleOrDefault("src/reportWebVitals.ts").Should().NotBeNull();
		SingleOrDefault("src/index.tsx").Should().NotBeNull();
		SingleOrDefault("src/react-app-env.d.ts").Should().NotBeNull();
	}
}
