namespace Aigamo.Petunia.Projects;

internal sealed record TypeScriptReactProjectOptions
{
	public bool UseAlias { get; init; }
}

internal sealed class TypeScriptReactProject : TypeScriptProject
{
	public TypeScriptReactProjectOptions Options { get; }

	public TypeScriptReactProject(TypeScriptReactProjectOptions options)
	{
		Options = options;
	}

	internal static string GenerateGitignore()
	{
		// TODO
		return """
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
			
			""";
	}

	internal static string GeneratePackageJson(bool useAlias)
	{
		var dependencies = new JsonObject()
			.AddEntry("@testing-library/jest-dom", "^5.14.1")
			.AddEntry("@testing-library/react", "^13.0.0")
			.AddEntry("@testing-library/user-event", "^13.2.1")
			.AddEntry("@types/jest", "^27.0.1")
			.AddEntry("@types/node", "^16.7.13")
			.AddEntry("@types/react", "^18.0.0")
			.AddEntry("@types/react-dom", "^18.0.0")
			.AddEntry("react", "^18.2.0")
			.AddEntry("react-dom", "^18.2.0")
			.AddEntry("react-scripts", "5.0.1")
			.AddEntry("typescript", "^4.4.2")
			.AddEntry("web-vitals", "^2.1.0");

		var devDependencies = new JsonObject();

		if (useAlias)
		{
			devDependencies.AddEntry("@craco/craco", "^7.0.0-alpha.9");
		}

		var obj = new JsonObject()
			.AddEntry("name", "petunia")
			.AddEntry("version", "0.1.0")
			.AddEntry("private", true)
			.AddEntry("dependencies", dependencies)
			.AddEntry("devDependencies", devDependencies.Entries.Any() ? devDependencies : null)
			.AddEntry(
				"scripts",
				useAlias
					? new JsonObject()
						.AddEntry("start", "craco start")
						.AddEntry("build", "craco build")
						.AddEntry("test", "craco test")
						.AddEntry("eject", "react-scripts eject")
					: new JsonObject()
						.AddEntry("start", "react-scripts start")
						.AddEntry("build", "react-scripts build")
						.AddEntry("test", "react-scripts test")
						.AddEntry("eject", "react-scripts eject")
			)
			.AddEntry(
				"eslintConfig",
				new JsonObject()
					.AddEntry(
						"extends",
						new JsonArray()
							.AddItem("react-app")
							.AddItem("react-app/jest")
					)
			)
			.AddEntry(
				"browserslist",
				new JsonObject()
					.AddEntry(
						"production",
						new JsonArray()
							.AddItem(">0.2%")
							.AddItem("not dead")
							.AddItem("not op_mini all")
					)
					.AddEntry(
						"development",
						new JsonArray()
							.AddItem("last 1 chrome version")
							.AddItem("last 1 firefox version")
							.AddItem("last 1 safari version")
					)
			);

		return $"{obj.ToFormattedString(new())}{Constants.NewLine}";
	}

	internal static string GenerateTSConfigJson(bool useAlias)
	{
		var compilerOptions = new JsonObject()
			.AddEntry("target", "es5")
			.AddEntry(
				"lib",
				new JsonArray()
					.AddItem("dom")
					.AddItem("dom.iterable")
					.AddItem("esnext")
			)
			.AddEntry("allowJs", true)
			.AddEntry("skipLibCheck", true)
			.AddEntry("esModuleInterop", true)
			.AddEntry("allowSyntheticDefaultImports", true)
			.AddEntry("strict", true)
			.AddEntry("forceConsistentCasingInFileNames", true)
			.AddEntry("noFallthroughCasesInSwitch", true)
			.AddEntry("module", "esnext")
			.AddEntry("moduleResolution", "node")
			.AddEntry("resolveJsonModule", true)
			.AddEntry("isolatedModules", true)
			.AddEntry("noEmit", true)
			.AddEntry("jsx", "react-jsx");

		if (useAlias)
		{
			compilerOptions
				.AddEntry("baseUrl", "./")
				.AddEntry(
					"paths",
					new JsonObject()
						.AddEntry(
							"@/*",
							new JsonArray()
								.AddItem("./src/*")
						)
				);
		}

		var obj = new JsonObject()
			.AddEntry("compilerOptions", compilerOptions)
			.AddEntry(
				"include",
				new JsonArray()
					.AddItem("src")
			);

		return $"{obj.ToFormattedString(new())}{Constants.NewLine}";
	}

	internal static string GenerateESLintRcJS()
	{
		// TODO
		return """
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
			
			""";
	}

	internal static string GeneratePublicIndexHtml()
	{
		// TODO
		return """
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
			
			""";
	}

	internal static string GenerateSrcAppTsx()
	{
		// TODO
		return """
			import React from 'react';
			
			const App = (): React.ReactElement => {
				return <></>;
			};
			
			export default App;
			
			""";
	}

	internal static string GenerateSrcReportWebVitalsTS()
	{
		// TODO
		return """
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
			
			""";
	}

	internal static string GenerateSrcIndexTsx(bool useAlias)
	{
		// TODO
		if (useAlias)
		{
			return """
				import App from '@/App';
				import reportWebVitals from '@/reportWebVitals';
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
			
				""";
		}
		else
		{
			return """
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
			
				""";
		}
	}

	internal static string GenerateSrcReactAppEnvDTS()
	{
		// TODO
		return """
			/// <reference types="react-scripts" />
			
			""";
	}

	internal static string GenerateCracoConfigJS()
	{
		// TODO
		return """
			const path = require('path');
			
			module.exports = {
				webpack: {
					alias: {
						'@': path.join(__dirname, 'src'),
					},
				},
			};
			
			""";
	}

	public override IEnumerable<ProjectFile> GenerateProjectFiles()
	{
		yield return new(".editorconfig", GenerateEditorConfig());
		yield return new(".prettierrc.json", GeneratePrettierRcJson());

		var useAlias = Options.UseAlias;

		yield return new(".gitignore", GenerateGitignore());
		yield return new("package.json", GeneratePackageJson(useAlias));
		yield return new("tsconfig.json", GenerateTSConfigJson(useAlias));
		// TODO: yield return new(".eslintrc.js", GenerateESLintRcJS());
		yield return new("public/index.html", GeneratePublicIndexHtml());
		yield return new("src/App.tsx", GenerateSrcAppTsx());
		yield return new("src/reportWebVitals.ts", GenerateSrcReportWebVitalsTS());
		yield return new("src/index.tsx", GenerateSrcIndexTsx(useAlias));
		yield return new("src/react-app-env.d.ts", GenerateSrcReactAppEnvDTS());

		if (useAlias)
		{
			yield return new("craco.config.js", GenerateCracoConfigJS());
		}
	}
}
