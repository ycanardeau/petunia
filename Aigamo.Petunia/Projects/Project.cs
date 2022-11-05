namespace Aigamo.Petunia.Projects;

internal sealed record ProjectFile(string Path, string Text);

internal interface IProject
{
	IEnumerable<ProjectFile> GenerateProjectFiles();
}

internal abstract class Project : IProject
{
	internal static string GenerateEditorConfig()
	{
		// TODO
		return $$"""
			root = true

			[*]
			end_of_line = lf
			charset = utf-8
			trim_trailing_whitespace = true
			insert_final_newline = true
			indent_style = tab
			indent_size = 4
			
			""";
	}

	public abstract IEnumerable<ProjectFile> GenerateProjectFiles();
}
