import { JavaScriptImports } from '@/core/JavaScriptImport';
import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { PackageJsonDependency } from '@/features/common/projects/PackageJsonDependency';
import { Project, ProjectFile } from '@/features/common/projects/Project';
import { DotnetGitignoreGenerator } from '@/features/dotnet/projects/DotnetGitignoreGenerator';
import { PackageManager } from '@/features/fsharp/projects/PackageManager';
import { TargetLanguage } from '@/features/fsharp/projects/TargetLanguage';
import validate from 'validate-npm-package-name';

interface FSharpFableProjectOptions {
	projectName: string;
	packageManager: PackageManager;
	targetLanguage: TargetLanguage;
	createSrcAndDistFolders: boolean;
	useReact: boolean;
	useFableReact: boolean;
	useFeliz: boolean;
	useFelizUseElmish: boolean;
}

export class FSharpFableProject extends Project<FSharpFableProjectOptions> {
	generateConfigDotnetToolsJson(): string {
		return `{
  "version": 1,
  "isRoot": true,
  "tools": {
    "fable": {
      "version": "4.19.3",
      "commands": [
        "fable"
      ],
      "rollForward": false
    }
  }
}
`;
	}

	generateProgramFS(): string {
		return `// For more information see https://aka.ms/fsharp-console-apps
printfn "Hello from F#"
`;
	}

	generateFsproj(): string {
		const lines: string[] = [];
		lines.push('<Project Sdk="Microsoft.NET.Sdk">');
		lines.push('');
		lines.push('  <PropertyGroup>');
		lines.push('    <OutputType>Exe</OutputType>');
		lines.push('    <TargetFramework>net8.0</TargetFramework>');
		lines.push('    <RootNamespace>my_fable_project</RootNamespace>');
		lines.push('  </PropertyGroup>');
		lines.push('');
		lines.push('  <ItemGroup>');
		lines.push('    <Compile Include="Program.fs" />');
		lines.push('  </ItemGroup>');
		lines.push('');
		lines.push('  <ItemGroup>');
		lines.push(
			'    <PackageReference Include="Fable.Core" Version="4.3.0" />',
		);

		switch (this.options.targetLanguage) {
			case TargetLanguage.TypeScriptNode:
				lines.push(
					'    <PackageReference Include="Fable.Node" Version="1.3.0" />',
				);
				break;

			case TargetLanguage.TypeScriptBrowser:
				lines.push(
					'    <PackageReference Include="Fable.Browser.Dom" Version="2.17.0" />',
				);
				break;
		}

		if (this.options.useFableReact) {
			lines.push(
				'    <PackageReference Include="Fable.React" Version="9.4.0" />',
			);
		}

		if (this.options.useFeliz) {
			lines.push(
				'    <PackageReference Include="Feliz" Version="2.8.0" />',
			);
		}

		if (this.options.useFelizUseElmish) {
			lines.push(
				'    <PackageReference Include="Feliz.UseElmish" Version="2.5.0" />',
			);
		}

		lines.push('  </ItemGroup>');
		lines.push('');
		lines.push('</Project>');
		lines.push('');
		return this.joinLines(lines);
	}

	generatePackageJson(): string {
		if (this.options.projectName !== undefined) {
			const { validForNewPackages } = validate(this.options.projectName);
			if (!validForNewPackages) {
				throw new Error('Invalid project name');
			}
		}

		const { tab, newLine } = this.editorConfig;

		const devDependenciesObj = new PackageJsonDependency();

		switch (this.options.targetLanguage) {
			case TargetLanguage.TypeScriptNode:
				devDependenciesObj
					.addPackage('typescript')
					.addPackage('@types/node');
				break;

			case TargetLanguage.TypeScriptBrowser:
				devDependenciesObj.addPackage('vite');
				break;
		}

		const dependenciesObj = new PackageJsonDependency();

		if (this.options.useReact) {
			devDependenciesObj.addPackage('@vitejs/plugin-react');

			dependenciesObj
				.addPackage('react', '18.3.1')
				.addPackage('react-dom', '18.3.1');
		}

		const scriptsObj = new JsonObject();

		scriptsObj.addEntry(
			'test',
			'echo \\"Error: no test specified\\" && exit 1',
		);

		switch (this.options.targetLanguage) {
			case TargetLanguage.TypeScriptNode:
				scriptsObj
					.addEntry(
						'build:watch',
						[
							'dotnet',
							'fable',
							'watch',
							...(this.options.createSrcAndDistFolders
								? ['src', '-o', 'dist']
								: []),
							'--lang',
							'typescript',
							'--run',
							'npx',
							'tsc',
							this.options.createSrcAndDistFolders
								? 'dist/Program.ts'
								: 'Program.fs.ts',
							'--target',
							'es2022',
							'--skipLibCheck',
							'--watch',
							'--preserveWatchOutput',
						].join(' '),
					)
					.addEntry(
						'start',
						[
							'node',
							this.options.createSrcAndDistFolders
								? 'dist/Program.js'
								: 'Program.fs.js',
						].join(' '),
					);
				break;

			case TargetLanguage.TypeScriptBrowser:
				scriptsObj.addEntry(
					'dev',
					[
						'dotnet',
						'fable',
						'watch',
						...(this.options.createSrcAndDistFolders
							? ['src', '-o', 'dist']
							: []),
						'--lang',
						'typescript',
						'--run',
						'npx',
						'vite',
					].join(' '),
				);
				break;
		}

		const rootObj = new JsonObject()
			.addEntry('name', this.options.projectName)
			.addEntry('version', '1.0.0')
			.addEntry(
				'type',
				this.options.targetLanguage === TargetLanguage.TypeScriptNode
					? 'module'
					: undefined,
			)
			.addEntry('description', '')
			.addEntry(
				'main',
				this.options.createSrcAndDistFolders
					? 'dist/Program.js'
					: 'Program.fs.js',
			)
			.addEntry('scripts', scriptsObj)
			.addEntry('keywords', new JsonArray())
			.addEntry('author', '')
			.addEntry('license', 'UNLICENSED')
			.addEntry(
				'dependencies',
				dependenciesObj.entries.length > 0
					? dependenciesObj.orderByKey()
					: undefined,
			)
			.addEntry(
				'devDependencies',
				devDependenciesObj.entries.length > 0
					? devDependenciesObj.orderByKey()
					: undefined,
			);

		return `${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	}

	generateViteConfigTS(): string {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports().addNamedImport(
			'vite',
			(builder) => builder.addNamedExport('defineConfig'),
		);

		const pluginsArray = new JsonArray();

		if (this.options.useReact) {
			imports.addDefaultImport('react', '@vitejs/plugin-react');

			pluginsArray.addItem(new JsonLiteral('react()'));
		}

		const configObj = new JsonObject()
			.addEntry('clearScreen', false)
			.addEntry(
				'server',
				new JsonObject().addEntry(
					'watch',
					new JsonObject().addEntry(
						'ignored',
						new JsonArray().addItem('**/*.fs'),
					),
				),
			)
			.addEntry('plugins', pluginsArray);

		const lines: string[] = [];
		lines.push(`${imports.toFormattedString({ newLine })}`);

		lines.push('');
		lines.push('// https://vitejs.dev/config/');
		lines.push(
			`export default defineConfig(${configObj.toFormattedString({
				tab: tab,
				newLine: newLine,
				style: 'JavaScript',
			})});`,
		);
		return this.joinLines(lines);
	}

	generateIndexHtml(): string {
		const lines: string[] = [];
		lines.push('<!DOCTYPE html>');
		lines.push('<html lang="en">');
		lines.push('  <head>');
		lines.push('    <meta charset="UTF-8" />');
		lines.push(
			'    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
		);
		lines.push('    <title>Fable</title>');
		lines.push('  </head>');
		lines.push('  <body>');
		lines.push('    <div id="root"></div>');
		if (this.options.createSrcAndDistFolders) {
			lines.push(
				'    <script type="module" src="/dist/Program.ts"></script>',
			);
		} else {
			lines.push(
				'    <script type="module" src="/Program.fs.ts"></script>',
			);
		}
		lines.push('  </body>');
		lines.push('</html>');
		return this.joinLines(lines);
	}

	*generateProjectFiles(): Generator<ProjectFile> {
		yield {
			path: '.gitignore',
			text: new DotnetGitignoreGenerator(this.editorConfig, {}).generate(
				this.options.createSrcAndDistFolders ? ['dist/'] : [],
			),
		};

		yield {
			path: '.config/dotnet-tools.json',
			text: this.generateConfigDotnetToolsJson(),
		};

		yield {
			path: this.options.createSrcAndDistFolders
				? `src/Program.fs`
				: `Program.fs`,
			text: this.generateProgramFS(),
		};

		yield {
			path: this.options.createSrcAndDistFolders
				? `src/${this.options.projectName}.fsproj`
				: `${this.options.projectName}.fsproj`,
			text: this.generateFsproj(),
		};

		if (
			this.options.targetLanguage === TargetLanguage.TypeScriptNode ||
			this.options.targetLanguage === TargetLanguage.TypeScriptBrowser
		) {
			yield {
				path: 'package.json',
				text: this.generatePackageJson(),
			};
		}

		if (this.options.targetLanguage === TargetLanguage.TypeScriptBrowser) {
			yield {
				path: 'vite.config.ts',
				text: this.generateViteConfigTS(),
			};

			yield {
				path: 'index.html',
				text: this.generateIndexHtml(),
			};
		}
	}
}
