using Aigamo.Petunia.Projects;

namespace Aigamo.Petunia.Tests.Projects;

public sealed class TypeScriptProjectTests
{
	[Fact]
	public void GeneratePrettierRcJson()
	{
		TypeScriptProject.GeneratePrettierRcJson(new TypeScriptReactProjectOptions()).Should().Be("""
			{
				"singleQuote": true,
				"trailingComma": "all"
			}
			
			""");
	}

	[Fact]
	public void GeneratePrettierRcJson_SortImports()
	{
		TypeScriptProject.GeneratePrettierRcJson(new TypeScriptReactProjectOptions { SortImports = true }).Should().Be("""
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
