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
			path: `${this.options.projectName}.Contracts/GlobalUsings.cs`,
			text: `global using MediatR;
`,
		};

		yield {
			path: `${this.options.projectName}.Domain/${this.options.projectName}.Domain.csproj`,
			text: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="StronglyTypedId" />
  </ItemGroup>

</Project>
`,
		};

		yield {
			path: `${this.options.projectName}.Domain/Properties/AssemblyInfo.cs`,
			text: `using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("${this.options.projectName}.Infrastructure")]
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

		yield {
			path: `${this.options.projectName}.Application/Properties/AssemblyInfo.cs`,
			text: `using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("${this.options.projectName}.Infrastructure")]
[assembly: InternalsVisibleTo("${this.options.projectName}.Module")]
`,
		};

		yield {
			path: `${this.options.projectName}.Infrastructure/${this.options.projectName}.Infrastructure.csproj`,
			text: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Aspire.Pomelo.EntityFrameworkCore.MySql" />
    <PackageReference Include="Microsoft.EntityFrameworkCore" />
    <PackageReference Include="Microsoft.Extensions.Configuration" />
    <PackageReference Include="Microsoft.Extensions.Configuration.EnvironmentVariables" />
    <PackageReference Include="Microsoft.Extensions.Hosting.Abstractions" />
    <PackageReference Include="Pomelo.EntityFrameworkCore.MySql" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\\${this.options.projectName}.Application\\${this.options.projectName}.Application.csproj" />
    <ProjectReference Include="..\\${this.options.projectName}.Contracts\\${this.options.projectName}.Contracts.csproj" />
    <ProjectReference Include="..\\${this.options.projectName}.Domain\\${this.options.projectName}.Domain.csproj" />
  </ItemGroup>

</Project>
`,
		};

		yield {
			path: `${this.options.projectName}.Infrastructure/Properties/AssemblyInfo.cs`,
			text: `using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("${this.options.projectName}.Module")]
[assembly: InternalsVisibleTo("${this.options.projectName}.MigrationService")]
`,
		};

		yield {
			path: `${this.options.projectName}.Infrastructure/ServiceExtensions.cs`,
			text: `using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using ${this.options.projectName}.Infrastructure.Persistence;

namespace ${this.options.projectName}.Infrastructure;

file interface IInfrastructure;

internal static class ServiceExtensions
{
	public static IServiceCollection AddDbContext(this IHostApplicationBuilder builder)
	{
		return builder.Services.AddDbContext<ApplicationDbContext>(options =>
		{
			options.UseMySql(
				builder.Configuration.GetConnectionString("DefaultConnection"),
				MySqlServerVersion.LatestSupportedServerVersion,
				sqlOptions =>
				{
					sqlOptions
						// https://learn.microsoft.com/en-us/samples/dotnet/aspire-samples/aspire-efcore-migrations/
						.MigrationsAssembly("${this.options.projectName}.MigrationService")
						// https://www.milanjovanovic.tech/blog/using-multiple-ef-core-dbcontext-in-single-application
						.MigrationsHistoryTable(tableName: HistoryRepository.DefaultTableName, schema: ApplicationDbContext.Schema)
						// https://github.com/PomeloFoundation/Pomelo.EntityFrameworkCore.MySql/pull/982#issue-532498042
						.SchemaBehavior(MySqlSchemaBehavior.Translate, (schema, entity) => $"{schema ?? "dbo"}_{entity}");
				}
			);
		});
	}

	public static IHostApplicationBuilder AddInfrastructure(this IHostApplicationBuilder builder)
	{
		builder.Services.AddMediatR(config => config.RegisterServicesFromAssemblyContaining<IInfrastructure>());

		builder.AddDbContext();

		return builder;
	}
}
`,
		};

		yield {
			path: `${this.options.projectName}.Infrastructure/Persistence/ApplicationDbContext.cs`,
			text: `using Microsoft.EntityFrameworkCore;

namespace ${this.options.projectName}.Infrastructure.Persistence;

internal class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
	public static string Schema { get; } = "${this.options.projectName.replaceAll(
		'.',
		'_',
	)}";

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.HasDefaultSchema(Schema);
		modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
		base.OnModelCreating(modelBuilder);
	}
}
`,
		};

		yield {
			path: `${this.options.projectName}.Infrastructure/GlobalUsings.cs`,
			text: `global using MediatR;
`,
		};

		yield {
			path: `${this.options.projectName}.Endpoints/${this.options.projectName}.Endpoints.csproj`,
			text: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="FastEndpoints" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\\${this.options.projectName}.Contracts\\${this.options.projectName}.Contracts.csproj" />
  </ItemGroup>

</Project>
`,
		};

		yield {
			path: `${this.options.projectName}.Endpoints/Properties/AssemblyInfo.cs`,
			text: `using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("${this.options.projectName}.Module")]
`,
		};

		yield {
			path: `${this.options.projectName}.Endpoints/ServiceExtensions.cs`,
			text: `using FastEndpoints;
using Microsoft.Extensions.DependencyInjection;

namespace ${this.options.projectName}.Endpoints;

internal static class ServiceExtensions
{
	public static IServiceCollection AddEndpoints(this IServiceCollection services)
	{
		// TODO: services.AddFastEndpoints();
		return services;
	}
}
`,
		};

		yield {
			path: `${this.options.projectName}.Endpoints/GlobalUsings.cs`,
			text: `global using FastEndpoints;
global using MediatR;
`,
		};

		yield {
			path: `${this.options.projectName}.Module/${this.options.projectName}.Module.csproj`,
			text: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <ProjectReference Include="..\\${this.options.projectName}.Application\\${this.options.projectName}.Application.csproj" />
    <ProjectReference Include="..\\${this.options.projectName}.Endpoints\\${this.options.projectName}.Endpoints.csproj" />
    <ProjectReference Include="..\\${this.options.projectName}.Infrastructure\\${this.options.projectName}.Infrastructure.csproj" />
  </ItemGroup>

</Project>
`,
		};

		yield {
			path: `${this.options.projectName}.Module/Properties/AssemblyInfo.cs`,
			text: `using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("${this.options.projectName}.MigrationService")]
`,
		};

		yield {
			path: `${this.options.projectName}.Module/ServiceExtensions.cs`,
			text: `using Microsoft.Extensions.Hosting;
using ${this.options.projectName}.Application;
using ${this.options.projectName}.Endpoints;
using ${this.options.projectName}.Infrastructure;

namespace ${this.options.projectName}.Module;

internal static class ServiceExtensions
{
	public static IHostApplicationBuilder AddModule(this IHostApplicationBuilder builder)
	{
		builder.AddApplication();
		builder.AddInfrastructure();
		builder.Services.AddEndpoints();
		return builder;
	}
}
`,
		};
	}
}
