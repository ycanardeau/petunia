using Aigamo.Petunia.Projects;

namespace Aigamo.Petunia.Tests.Projects;

public sealed class ProjectTests
{
	[Fact]
	public void GenerateEditorConfig()
	{
		Project.GenerateEditorConfig().Should().Be("""
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
