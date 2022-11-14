namespace Aigamo.Petunia.Projects;

internal sealed record TypeScriptCreateReactAppProjectOptions
{
}

internal sealed class TypeScriptCreateReactAppProject : TypeScriptProject
{
	public TypeScriptCreateReactAppProjectOptions Options { get; }

	public TypeScriptCreateReactAppProject(TypeScriptCreateReactAppProjectOptions options)
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

	internal static string GeneratePackageJson()
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

		var obj = new JsonObject()
			.AddEntry("name", "petunia")
			.AddEntry("version", "0.1.0")
			.AddEntry("private", true)
			.AddEntry("dependencies", dependencies)
			.AddEntry("devDependencies", devDependencies.Entries.Any() ? devDependencies : null)
			.AddEntry(
				"scripts",
				new JsonObject()
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

	internal static string GenerateTSConfigJson()
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
		var obj = new JsonObject()
			.AddEntry("parser", "@typescript-eslint/parser")
			.AddEntry(
				"parserOptions",
				new JsonObject()
					.AddEntry("project", "tsconfig.json")
					.AddEntry("sourceType", "module")
					.AddEntry("tsconfigRootDir", new JsonLiteral("__dirname"))
			)
			.AddEntry(
				"plugins",
				new JsonArray()
					.AddItem("@typescript-eslint/eslint-plugin")
			)
			.AddEntry(
				"extends",
				new JsonArray()
					.AddItem("react-app")
					.AddItem("react-app/jest")
					.AddItem("plugin:@typescript-eslint/recommended")
					.AddItem("plugin:prettier/recommended")
			)
			.AddEntry("root", true)
			.AddEntry(
				"env",
				new JsonObject()
					.AddEntry("node", true)
					.AddEntry("jest", true)
			)
			.AddEntry(
				"ignorePatterns",
				new JsonArray()
					.AddItem(".eslintrc.js")
			)
			.AddEntry(
				"rules",
				new JsonObject()
					.AddEntry("@typescript-eslint/interface-name-prefix", "off")
					.AddEntry("@typescript-eslint/explicit-function-return-type", "error")
					.AddEntry("@typescript-eslint/explicit-module-boundary-types", "off")
					.AddEntry("@typescript-eslint/no-explicit-any", "off")
					.AddEntry("@typescript-eslint/no-empty-function", "off")
			);

		return $"module.exports = {obj.ToFormattedString(new() { Style = FormatStyle.JavaScript })};{Constants.NewLine}";
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
		var imports = new JavaScriptImports()
			.AddImport(
				new JavaScriptDefaultImport(moduleName: "react", defaultExport: "React")
			);

		// TODO
		return $$"""
			{{imports}}
			
			const App = (): React.ReactElement => {
				return <></>;
			};
			
			export default App;
			
			""";
	}

	internal static string GenerateSrcReportWebVitalsTS()
	{
		var imports = new JavaScriptImports()
			.AddImport(
				new JavaScriptNamedImport("web-vitals")
					.AddExport("ReportHandler")
			);

		// TODO
		return $$"""
			{{imports}}
			
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

	internal static string GenerateSrcIndexTsx()
	{
		var imports = new JavaScriptImports()
			.AddImport(new JavaScriptDefaultImport(moduleName: "./App", defaultExport: "App"))
			.AddImport(new JavaScriptDefaultImport(moduleName: "./reportWebVitals", defaultExport: "reportWebVitals"))
			.AddImport(new JavaScriptDefaultImport(moduleName: "react", defaultExport: "React"))
			.AddImport(new JavaScriptDefaultImport(moduleName: "react-dom/client", defaultExport: "ReactDOM"));

		// TODO
		return $$"""
			{{imports}}
			
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

	internal static string GenerateSrcReactAppEnvDTS()
	{
		// TODO
		return """
			/// <reference types="react-scripts" />
			
			""";
	}

	public override IEnumerable<ProjectFile> GenerateProjectFiles()
	{
		yield return new(".editorconfig", GenerateEditorConfig());
		yield return new(".prettierrc.json", GeneratePrettierRcJson());

		yield return new(".gitignore", GenerateGitignore());
		yield return new("package.json", GeneratePackageJson());
		yield return new("tsconfig.json", GenerateTSConfigJson());
		// TODO: yield return new(".eslintrc.js", GenerateESLintRcJS());
		yield return new("public/index.html", GeneratePublicIndexHtml());
		yield return new("src/App.tsx", GenerateSrcAppTsx());
		yield return new("src/reportWebVitals.ts", GenerateSrcReportWebVitalsTS());
		yield return new("src/index.tsx", GenerateSrcIndexTsx());
		yield return new("src/react-app-env.d.ts", GenerateSrcReactAppEnvDTS());
	}
}
