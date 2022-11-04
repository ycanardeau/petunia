using Aigamo.Petunia.Projects;

namespace Aigamo.Petunia.Tests.Projects;

public sealed class TypeScriptProjectTests
{
	private sealed class FakeTypeScriptProject : TypeScriptProject
	{
		public override IEnumerable<ProjectFile> GenerateProjectFiles()
		{
			throw new NotImplementedException();
		}
	}

	private readonly FakeTypeScriptProject _project;

	public TypeScriptProjectTests()
	{
		_project = new FakeTypeScriptProject();
	}

	[Fact]
	public void GeneratePrettierRcJson()
	{
		_project.GeneratePrettierRcJson().Should().Be($$"""
			{
				"singleQuote": true,
				"trailingComma": "all",
				"importOrder": [
					"^@core/(.*)$",
					"^@server/(.*)$",
					"^@ui/(.*)$",
					"^[./]"
				],
				"importOrderSeparation": true,
				"importOrderSortSpecifiers": true
			}
			
			""");
	}
}
