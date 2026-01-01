import { Project, type ProjectFile } from '@/features/common/projects/Project';
import { Database } from '@/features/csharp/projects/Database';
import { PackageManager } from '@/features/csharp/projects/PackageManager';
import { sortBy } from 'lodash-es';

interface CSharpCleanArchitectureProjectOptions {
	projectName: string;
	packageManager: PackageManager;
	database: Database;
}

export class CSharpCleanArchitectureProject extends Project<CSharpCleanArchitectureProjectOptions> {
	generateInfrastructureInfrastructureCsproj(): string {
		const packageReferences = [
			'Microsoft.EntityFrameworkCore',
			'Microsoft.Extensions.Configuration',
			'Microsoft.Extensions.Configuration.EnvironmentVariables',
			'Microsoft.Extensions.Hosting.Abstractions',
		];

		switch (this.options.database) {
			case Database.PostgreSql:
				packageReferences.push(
					'Npgsql.EntityFrameworkCore.PostgreSQL',
					'Aspire.Npgsql.EntityFrameworkCore.PostgreSQL',
				);
				break;

			case Database.MySql:
				packageReferences.push(
					'Pomelo.EntityFrameworkCore.MySql',
					'Aspire.Pomelo.EntityFrameworkCore.MySql',
				);
				break;

			default:
				const _exhaustiveCheck: never = this.options.database;
				return _exhaustiveCheck;
		}

		const sortedPackageReferences = sortBy(packageReferences);

		return `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
${sortedPackageReferences
	.map(
		(packageReference) =>
			`    <PackageReference Include="${packageReference}" />`,
	)
	.join('\n')}
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\\${this.options.projectName}.Application\\${
		this.options.projectName
	}.Application.csproj" />
    <ProjectReference Include="..\\${this.options.projectName}.Contracts\\${
		this.options.projectName
	}.Contracts.csproj" />
    <ProjectReference Include="..\\${this.options.projectName}.Domain\\${
		this.options.projectName
	}.Domain.csproj" />
  </ItemGroup>

</Project>
`;
	}

	generateInfrastructureServiceExtensionsCS(): string {
		let dbContextOptions: string;
		switch (this.options.database) {
			case Database.PostgreSql:
				dbContextOptions = `			options.UseNpgsql(
				builder.Configuration.GetConnectionString("DefaultConnection"),
				sqlOptions =>
				{
					sqlOptions
						// https://learn.microsoft.com/en-us/samples/dotnet/aspire-samples/aspire-efcore-migrations/
						.MigrationsAssembly("${this.options.projectName}.MigrationService")
						// https://www.milanjovanovic.tech/blog/using-multiple-ef-core-dbcontext-in-single-application
						.MigrationsHistoryTable(tableName: HistoryRepository.DefaultTableName, schema: ApplicationDbContext.Schema);
				}
			);`;
				break;

			case Database.MySql:
				dbContextOptions = `			options.UseMySql(
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
			);`;
				break;

			default:
				const _exhaustiveCheck: never = this.options.database;
				return _exhaustiveCheck;
		}

		const usings = [
			'Microsoft.EntityFrameworkCore',
			'Microsoft.EntityFrameworkCore.Migrations',
			'Microsoft.Extensions.Configuration',
			'Microsoft.Extensions.DependencyInjection',
			'Microsoft.Extensions.Hosting',
			`${this.options.projectName}.Infrastructure.Persistence`,
		];

		switch (this.options.database) {
			case Database.PostgreSql:
				break;

			case Database.MySql:
				usings.push('Pomelo.EntityFrameworkCore.MySql.Infrastructure');
				break;

			default:
				const _exhaustiveCheck: never = this.options.database;
				return _exhaustiveCheck;
		}

		const sortedUsings = sortBy(usings);

		return `${sortedUsings.map((using) => `using ${using};`).join('\n')}

namespace ${this.options.projectName}.Infrastructure;

file interface IInfrastructure;

internal static class ServiceExtensions
{
	public static IServiceCollection AddDbContext(this IHostApplicationBuilder builder)
	{
		return builder.Services.AddDbContext<ApplicationDbContext>(options =>
		{
${dbContextOptions}
		});
	}

	public static IHostApplicationBuilder AddInfrastructure(this IHostApplicationBuilder builder)
	{
		builder.Services.AddMediatR(config => config.RegisterServicesFromAssemblyContaining<IInfrastructure>());

		builder.AddDbContext();

		return builder;
	}
}
`;
	}

	*generateInfrastructureProjectFiles(): Generator<ProjectFile> {
		yield {
			path: `${this.options.projectName}.Infrastructure/${this.options.projectName}.Infrastructure.csproj`,
			text: this.generateInfrastructureInfrastructureCsproj(),
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
			text: this.generateInfrastructureServiceExtensionsCS(),
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
	}

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

		yield* this.generateInfrastructureProjectFiles();

		yield {
			path: `${this.options.projectName}.Endpoints/${this.options.projectName}.Endpoints.csproj`,
			text: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <FrameworkReference Include="Microsoft.AspNetCore.App" />
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
			text: `using Microsoft.Extensions.DependencyInjection;

namespace ${this.options.projectName}.Endpoints;

internal static class ServiceExtensions
{
	public static IServiceCollection AddEndpoints(this IServiceCollection services)
	{
		return services;
	}
}
`,
		};

		yield {
			path: `${this.options.projectName}.Endpoints/GlobalUsings.cs`,
			text: `global using MediatR;
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
