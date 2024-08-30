import { Project, ProjectFile } from '@/features/common/projects/Project';
import { DotnetGitignoreGenerator } from '@/features/fsharp/projects/DotnetGitignoreGenerator';
import { PackageManager } from '@/features/fsharp/projects/PackageManager';
import { TargetLanguage } from '@/features/fsharp/projects/TargetLanguage';

interface FSharpFableProjectOptions {
	projectName: string;
	packageManager: PackageManager;
	targetLanguage: TargetLanguage;
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
		return `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <RootNamespace>my_fable_project</RootNamespace>
  </PropertyGroup>

  <ItemGroup>
    <Compile Include="Program.fs" />
  </ItemGroup>

  <ItemGroup>
    <PackageReference Include="Fable.Core" Version="4.3.0" />
  </ItemGroup>

</Project>
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
	}
}
