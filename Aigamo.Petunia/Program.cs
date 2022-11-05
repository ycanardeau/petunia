using Aigamo.Petunia.Projects;

namespace Aigamo.Petunia;

internal class Program
{
	private static async Task Main(string[] args)
	{
		var projectPath = "petunia";
		if (Directory.Exists(projectPath)) Directory.Delete(projectPath, recursive: true);
		Directory.CreateDirectory(projectPath);

		var projectOptions = new TypeScriptReactProjectOptions
		{
			UseAlias = true,
			UseESLintAndPrettier = true,
			SortImports = true,
			InstallAjv = true,
			InstallFluentUIReactIcons = true,
			InstallLodashES = true,
			InstallMobX = true,
			InstallReactRouter = true,
			InstallQs = true,
		};
		var project = new TypeScriptReactProject(projectOptions);
		var projectFiles = project.GenerateProjectFiles();
		await Task.WhenAll(projectFiles.Select(projectFile =>
		{
			var directoryName = Path.GetDirectoryName(projectFile.Path);
			if (!string.IsNullOrEmpty(directoryName)) Directory.CreateDirectory(Path.Combine(projectPath, directoryName));

			return File.WriteAllTextAsync(Path.Combine(projectPath, projectFile.Path), projectFile.Text);
		}));
	}
}
