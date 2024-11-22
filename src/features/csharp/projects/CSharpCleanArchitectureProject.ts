import { Project, ProjectFile } from '@/features/common/projects/Project';
import { PackageManager } from '@/features/csharp/projects/PackageManager';

interface CSharpCleanArchitectureProjectOptions {
	projectName: string;
	packageManager: PackageManager;
}

export class CSharpCleanArchitectureProject extends Project<CSharpCleanArchitectureProjectOptions> {
	*generateProjectFiles(): Generator<ProjectFile> {
		yield {
			path: `${this.options.projectName}.Contracts/${this.options.projectName}.Contracts.csproj`,
			text: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="MediatR" />
  </ItemGroup>

</Project>
`,
		};

		yield {
			path: `${this.options.projectName}.Application/${this.options.projectName}.Application.csproj`,
			text: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="FluentValidation.DependencyInjectionExtensions" />
    <PackageReference Include="Microsoft.Extensions.Hosting.Abstractions" />
  </ItemGroup>

</Project>
`,
		};

		yield {
			path: `${this.options.projectName}.Application/ServiceExtensions.cs`,
			text: `using FluentValidation;
using Microsoft.Extensions.Hosting;

namespace ${this.options.projectName}.Application;

file interface IApplication;

internal static class ServiceExtensions
{
	public static IHostApplicationBuilder AddApplication(this IHostApplicationBuilder builder)
	{
		builder.Services.AddValidatorsFromAssemblyContaining<IApplication>(includeInternalTypes: true);

		return builder;
	}
}
`,
		};
	}
}
