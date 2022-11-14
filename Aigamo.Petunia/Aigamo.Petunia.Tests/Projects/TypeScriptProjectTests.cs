using Aigamo.Petunia.Projects;

namespace Aigamo.Petunia.Tests.Projects;

public sealed class TypeScriptProjectTests
{
	[Fact]
	public void GeneratePrettierRcJson()
	{
		TypeScriptProject.GeneratePrettierRcJson().Should().Be("""
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
