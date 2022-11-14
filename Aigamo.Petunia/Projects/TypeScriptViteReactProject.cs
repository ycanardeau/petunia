namespace Aigamo.Petunia.Projects;

internal sealed record TypeScriptViteReactProjectOptions
{
}

internal class TypeScriptViteReactProject : TypeScriptProject
{
	public TypeScriptViteReactProjectOptions Options { get; }

	public TypeScriptViteReactProject(TypeScriptViteReactProjectOptions options)
	{
		Options = options;
	}

	internal static string GenerateGitignore()
	{
		// TODO
		return """
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
			
			""";
	}

	internal static string GeneratePackageJson()
	{
		var dependencies = new JsonObject()
			.AddEntry("react", "^18.2.0")
			.AddEntry("react-dom", "^18.2.0");

		var devDependencies = new JsonObject()
			.AddEntry("@types/react", "^18.0.24")
			.AddEntry("@types/react-dom", "^18.0.8")
			.AddEntry("@vitejs/plugin-react", "^2.2.0")
			.AddEntry("typescript", "^4.6.4")
			.AddEntry("vite", "^3.2.3");

		var obj = new JsonObject()
			.AddEntry("name", "petunia")
			.AddEntry("private", true)
			.AddEntry("version", "0.0.0")
			.AddEntry("type", "module")
			.AddEntry(
				"scripts",
				new JsonObject()
					.AddEntry("dev", "vite")
					.AddEntry("build", "tsc && vite build")
					.AddEntry("preview", "vite preview")
			)
			.AddEntry("dependencies", dependencies)
			.AddEntry("devDependencies", devDependencies);

		return $"{obj.ToFormattedString(new())}{Constants.NewLine}";
	}

	internal static string GenerateTSConfigJson()
	{
		var compilerOptions = new JsonObject()
			.AddEntry("target", "ESNext")
			.AddEntry("useDefineForClassFields", true)
			.AddEntry(
				"lib",
				new JsonArray()
					.AddItem("DOM")
					.AddItem("DOM.Iterable")
					.AddItem("ESNext")
			)
			.AddEntry("allowJs", false)
			.AddEntry("skipLibCheck", true)
			.AddEntry("esModuleInterop", false)
			.AddEntry("allowSyntheticDefaultImports", true)
			.AddEntry("strict", true)
			.AddEntry("forceConsistentCasingInFileNames", true)
			.AddEntry("module", "ESNext")
			.AddEntry("moduleResolution", "Node")
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
			)
			.AddEntry(
				"references",
				new JsonArray()
					.AddItem(
						new JsonObject()
							.AddEntry("path", "./tsconfig.node.json")
					)
			);

		return $"{obj.ToFormattedString(new())}{Constants.NewLine}";
	}

	internal static string GenerateTSConfigNodeJson()
	{
		var compilerOptions = new JsonObject()
			.AddEntry("composite", true)
			.AddEntry("module", "ESNext")
			.AddEntry("moduleResolution", "Node")
			.AddEntry("allowSyntheticDefaultImports", true);

		var obj = new JsonObject()
			.AddEntry("compilerOptions", compilerOptions)
			.AddEntry(
				"include",
				new JsonArray()
					.AddItem("vite.config.ts")
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

	internal static string GenerateIndexHtml()
	{
		// TODO
		return """
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
			
			""";
	}

	internal static string GenerateViteConfigTS()
	{
		var imports = new JavaScriptImports()
			.AddImport(
				new JavaScriptNamedImport(moduleName: "vite")
					.AddExport("defineConfig")
			)
			.AddImport(new JavaScriptDefaultImport(moduleName: "@vitejs/plugin-react", defaultExport: "react"));

		// TODO
		return $$"""
			{{imports}}

			// https://vitejs.dev/config/
			export default defineConfig({
				plugins: [react()],
			});
			
			""";
	}

	internal static string GenerateSrcAppTsx()
	{
		var imports = new JavaScriptImports()
			.AddImport(new JavaScriptDefaultImport(moduleName: "react", defaultExport: "React"));

		// TODO
		return $$"""
			{{imports}}
			
			const App = (): React.ReactElement => {
				return <></>;
			};
			
			export default App;
			
			""";
	}

	internal static string GenerateSrcMainTsx()
	{
		var imports = new JavaScriptImports()
			.AddImport(new JavaScriptDefaultImport(moduleName: "./App", defaultExport: "App"))
			.AddImport(new JavaScriptDefaultImport(moduleName: "react", defaultExport: "React"))
			.AddImport(new JavaScriptDefaultImport(moduleName: "react-dom/client", defaultExport: "ReactDOM"));

		// TODO
		return $$"""
			{{imports}}
			
			ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
				<React.StrictMode>
					<App />
				</React.StrictMode>,
			);
			
			""";
	}

	internal static string GenerateSrcViteEnvDTS()
	{
		// TODO
		return """
			/// <reference types="vite/client" />
			
			""";
	}

	public override IEnumerable<ProjectFile> GenerateProjectFiles()
	{
		yield return new(".editorconfig", GenerateEditorConfig());
		yield return new(".prettierrc.json", GeneratePrettierRcJson());

		yield return new(".gitignore", GenerateGitignore());
		yield return new("package.json", GeneratePackageJson());
		yield return new("tsconfig.json", GenerateTSConfigJson());
		yield return new("tsconfig.node.json", GenerateTSConfigNodeJson());
		// TODO: yield return new(".eslintrc.js", GenerateESLintRcJS());
		yield return new("index.html", GenerateIndexHtml());
		yield return new("vite.config.ts", GenerateViteConfigTS());
		yield return new("src/App.tsx", GenerateSrcAppTsx());
		yield return new("src/main.tsx", GenerateSrcMainTsx());
		yield return new("src/vite-env.d.ts", GenerateSrcViteEnvDTS());
	}
}
