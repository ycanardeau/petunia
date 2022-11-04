namespace Aigamo.Petunia.Projects;

internal sealed class TypeScriptReactProject : TypeScriptProject
{
	internal string GenerateGitignore()
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

	internal string GeneratePackageJson()
	{
		var obj = new JsonObject()
			.AddEntry("name", "petunia")
			.AddEntry("version", "0.1.0")
			.AddEntry("private", true)
			.AddEntry(
				"dependencies",
				new JsonObject()
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
					.AddEntry("web-vitals", "^2.1.0")
			)
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

	internal string GenerateTSConfigJson()
	{
		var obj = new JsonObject()
			.AddEntry(
				"compilerOptions",
				new JsonObject()
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
					.AddEntry("jsx", "react-jsx")
			)
			.AddEntry(
				"include",
				new JsonArray()
					.AddItem("src")
			);

		return $"{obj.ToFormattedString(new())}{Constants.NewLine}";
	}

	internal string GenerateESLintRcJS()
	{
		// TODO
		return $$"""
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

	public override IEnumerable<ProjectFile> GenerateProjectFiles()
	{
		yield return new(".editorconfig", GenerateEditorConfig());
		yield return new(".prettierrc.json", GeneratePrettierRcJson());

		yield return new(".gitignore", GenerateGitignore());
		yield return new("package.json", GeneratePackageJson());
		yield return new("tsconfig.json", GenerateTSConfigJson());
		yield return new(".eslintrc.js", GenerateESLintRcJS());
	}
}
