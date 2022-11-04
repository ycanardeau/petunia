using Aigamo.Petunia.Projects;

namespace Aigamo.Petunia.Tests.Projects;

public sealed class ProjectTests
{
	private sealed class FakeProject : Project
	{
		public override IEnumerable<ProjectFile> GenerateProjectFiles()
		{
			throw new NotImplementedException();
		}
	}

	private readonly FakeProject _project;

	public ProjectTests()
	{
		_project = new();
	}

	[Fact]
	public void GenerateEditorConfig()
	{
		_project.GenerateEditorConfig().Should().Be("""
			root = true

			[*]
			end_of_line = lf
			charset = utf-8
			trim_trailing_whitespace = true
			insert_final_newline = true
			indent_style = tab
			indent_size = 4

			""");
	}
}
