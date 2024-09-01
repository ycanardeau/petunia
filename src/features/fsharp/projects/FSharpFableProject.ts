import { JavaScriptImports } from '@/core/JavaScriptImport';
import { JsonArray, JsonObject } from '@/core/JsonValue';
import { PackageJsonDependency } from '@/features/common/projects/PackageJsonDependency';
import { Project, ProjectFile } from '@/features/common/projects/Project';
import { DotnetGitignoreGenerator } from '@/features/fsharp/projects/DotnetGitignoreGenerator';
import { PackageManager } from '@/features/fsharp/projects/PackageManager';
import { TargetLanguage } from '@/features/fsharp/projects/TargetLanguage';
import validate from 'validate-npm-package-name';

interface FSharpFableProjectOptions {
	projectName: string;
	packageManager: PackageManager;
	targetLanguage: TargetLanguage;
	useFableReact: boolean;
	useFeliz: boolean;
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
						'dotnet fable watch --lang typescript --run npx tsc Program.fs.ts --target es2022 --skipLibCheck --watch --preserveWatchOutput',
					)
					.addEntry('start', 'node Program.fs.js');
				break;

			case TargetLanguage.TypeScriptBrowser:
				scriptsObj.addEntry(
					'dev',
					'dotnet fable watch --lang typescript --run npx vite',
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
			.addEntry('main', 'Program.fs.js')
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
			);

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
		return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fable</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/Program.fs.ts"></script>
  </body>
</html>
`;
	}

	*generateProjectFiles(): Generator<ProjectFile> {
		yield {
			path: '.gitignore',
			text: new DotnetGitignoreGenerator(
				this.editorConfig,
				{},
			).generate(),
		};

		yield {
			path: '.config/dotnet-tools.json',
			text: this.generateConfigDotnetToolsJson(),
		};

		yield {
			path: `Program.fs`,
			text: this.generateProgramFS(),
		};

		yield {
			path: `${this.options.projectName}.fsproj`,
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
