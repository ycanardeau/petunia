import { CSharpAspNetCoreProject } from '@/features/csharp/projects/CSharpAspNetCoreProject';
import { PackageManager } from '@/features/csharp/projects/PackageManager';
import { describe, expect, test } from 'vitest';

describe('CSharpAspNetCoreProject', () => {
	test('generateDirectoryBuildProps', () => {
		const project = new CSharpAspNetCoreProject(undefined, {
			projectName: 'WebApp',
			packageManager: PackageManager.NuGet,
			useAigamoMatchGenerator: false,
			useAigamoResults: false,
		});
		const actual = project.generateDirectoryBuildProps();
		const expected = `<Project>
	<PropertyGroup>
		<TargetFramework>net10.0</TargetFramework>
		<ImplicitUsings>enable</ImplicitUsings>
		<Nullable>enable</Nullable>
	</PropertyGroup>
</Project>
`;
		expect(actual).toBe(expected);
	});

	test('generateDirectoryBuildProps useAigamoMatchGenerator useAigamoResults', () => {
		const project = new CSharpAspNetCoreProject(undefined, {
			projectName: 'WebApp',
			packageManager: PackageManager.NuGet,
			useAigamoMatchGenerator: true,
			useAigamoResults: true,
		});
		const actual = project.generateDirectoryBuildProps();
		const expected = `<Project>
	<PropertyGroup>
		<TargetFramework>net10.0</TargetFramework>
		<ImplicitUsings>enable</ImplicitUsings>
		<Nullable>enable</Nullable>
	</PropertyGroup>

	<ItemGroup>
		<PackageReference Include="Aigamo.MatchGenerator" />
		<Using Include="Aigamo.MatchGenerator" />
		<PackageReference Include="Aigamo.Results" />
		<Using Include="Aigamo.Results" />
	</ItemGroup>
</Project>
`;
		expect(actual).toBe(expected);
	});

	test('generateDirectoryPackagesProps useAigamoResults', () => {
		const project = new CSharpAspNetCoreProject(undefined, {
			projectName: 'WebApp',
			packageManager: PackageManager.NuGet,
			useAigamoMatchGenerator: false,
			useAigamoResults: true,
		});
		const actual = project.generateDirectoryPackagesProps();
		expect(actual).toContain(
			'<PackageVersion Include="Aigamo.Results" Version="0.0.0-preview005" />',
		);
		expect(actual).not.toContain('Aigamo.MatchGenerator');
	});

	test('generateEditorConfig useAigamoResults', () => {
		const project = new CSharpAspNetCoreProject(undefined, {
			projectName: 'WebApp',
			packageManager: PackageManager.NuGet,
			useAigamoMatchGenerator: false,
			useAigamoResults: true,
		});
		const actual = project.generateEditorConfig();
		expect(actual).toContain('aigamo_results_conversion_style = implicit');
	});

	test('generateEditorConfig', () => {
		const project = new CSharpAspNetCoreProject(undefined, {
			projectName: 'WebApp',
			packageManager: PackageManager.NuGet,
			useAigamoMatchGenerator: false,
			useAigamoResults: false,
		});
		const actual = project.generateEditorConfig();
		expect(actual).not.toContain('aigamo_results_conversion_style');
	});
});
