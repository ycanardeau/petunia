using Aigamo.Petunia.Projects;

namespace Aigamo.Petunia.Tests.Projects;

public sealed class TypeScriptReactProjectTests
{
	private readonly TypeScriptReactProject _project;

	public TypeScriptReactProjectTests()
	{
		_project = new TypeScriptReactProject();
	}

	[Fact]
	public void GenerateGitignore()
	{
		_project.GenerateGitignore().Should().Be("""
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
		_project.GeneratePackageJson().Should().Be($$"""
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
		_project.GenerateTSConfigJson().Should().Be($$"""
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
		_project.GenerateESLintRcJS().Should().Be($$"""
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
	public void GenerateProjectFiles()
	{
		var projectFiles = _project.GenerateProjectFiles();
		projectFiles.Count(projectFile => projectFile.Path == ".editorconfig").Should().Be(1);
		projectFiles.Count(projectFile => projectFile.Path == ".prettierrc.json").Should().Be(1);
		projectFiles.Count(projectFile => projectFile.Path == ".gitignore").Should().Be(1);
		projectFiles.Count(projectFile => projectFile.Path == "package.json").Should().Be(1);
		projectFiles.Count(projectFile => projectFile.Path == "tsconfig.json").Should().Be(1);
		projectFiles.Count(projectFile => projectFile.Path == ".eslintrc.js").Should().Be(1);
	}
}
