import { CSharpCleanArchitectureProject } from '@/features/csharp/projects/CSharpCleanArchitectureProject';
import { Database } from '@/features/csharp/projects/Database';
import { PackageManager } from '@/features/csharp/projects/PackageManager';
import { describe, expect, test } from 'vitest';

describe('CSharpCleanArchitectureProject', () => {
	test('generateInfrastructureInfrastructureCsproj PostgreSql', () => {
		const project = new CSharpCleanArchitectureProject(undefined, {
			projectName: 'CSharp.CleanArchitecture',
			packageManager: PackageManager.NuGet,
			database: Database.PostgreSql,
		});
		const actual = project.generateInfrastructureInfrastructureCsproj();
		const expected = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Aspire.Npgsql.EntityFrameworkCore.PostgreSQL" />
    <PackageReference Include="Microsoft.EntityFrameworkCore" />
    <PackageReference Include="Microsoft.Extensions.Configuration" />
    <PackageReference Include="Microsoft.Extensions.Configuration.EnvironmentVariables" />
    <PackageReference Include="Microsoft.Extensions.Hosting.Abstractions" />
    <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\\CSharp.CleanArchitecture.Application\\CSharp.CleanArchitecture.Application.csproj" />
    <ProjectReference Include="..\\CSharp.CleanArchitecture.Contracts\\CSharp.CleanArchitecture.Contracts.csproj" />
    <ProjectReference Include="..\\CSharp.CleanArchitecture.Domain\\CSharp.CleanArchitecture.Domain.csproj" />
  </ItemGroup>

</Project>
`;
		expect(actual).toBe(expected);
	});

	test('generateInfrastructureInfrastructureCsproj MySql', () => {
		const project = new CSharpCleanArchitectureProject(undefined, {
			projectName: 'CSharp.CleanArchitecture',
			packageManager: PackageManager.NuGet,
			database: Database.MySql,
		});
		const actual = project.generateInfrastructureInfrastructureCsproj();
		const expected = `<Project Sdk="Microsoft.NET.Sdk">

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
    <ProjectReference Include="..\\CSharp.CleanArchitecture.Application\\CSharp.CleanArchitecture.Application.csproj" />
    <ProjectReference Include="..\\CSharp.CleanArchitecture.Contracts\\CSharp.CleanArchitecture.Contracts.csproj" />
    <ProjectReference Include="..\\CSharp.CleanArchitecture.Domain\\CSharp.CleanArchitecture.Domain.csproj" />
  </ItemGroup>

</Project>
`;
		expect(actual).toBe(expected);
	});

	test('generateInfrastructureServiceExtensionsCS PostgreSql', () => {
		const project = new CSharpCleanArchitectureProject(undefined, {
			projectName: 'CSharp.CleanArchitecture',
			packageManager: PackageManager.NuGet,
			database: Database.PostgreSql,
		});
		const actual = project.generateInfrastructureServiceExtensionsCS();
		const expected = `using CSharp.CleanArchitecture.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CSharp.CleanArchitecture.Infrastructure;

file interface IInfrastructure;

internal static class ServiceExtensions
{
	public static IServiceCollection AddDbContext(this IHostApplicationBuilder builder)
	{
		return builder.Services.AddDbContext<ApplicationDbContext>(options =>
		{
			options.UseNpgsql(
				builder.Configuration.GetConnectionString("DefaultConnection"),
				sqlOptions =>
				{
					sqlOptions
						// https://learn.microsoft.com/en-us/samples/dotnet/aspire-samples/aspire-efcore-migrations/
						.MigrationsAssembly("CSharp.CleanArchitecture.MigrationService")
						// https://www.milanjovanovic.tech/blog/using-multiple-ef-core-dbcontext-in-single-application
						.MigrationsHistoryTable(tableName: HistoryRepository.DefaultTableName, schema: ApplicationDbContext.Schema);
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
`;
		expect(actual).toBe(expected);
	});

	test('generateInfrastructureServiceExtensionsCS MySql', () => {
		const project = new CSharpCleanArchitectureProject(undefined, {
			projectName: 'CSharp.CleanArchitecture',
			packageManager: PackageManager.NuGet,
			database: Database.MySql,
		});
		const actual = project.generateInfrastructureServiceExtensionsCS();
		const expected = `using CSharp.CleanArchitecture.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace CSharp.CleanArchitecture.Infrastructure;

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
						.MigrationsAssembly("CSharp.CleanArchitecture.MigrationService")
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
`;
		expect(actual).toBe(expected);
	});
});
