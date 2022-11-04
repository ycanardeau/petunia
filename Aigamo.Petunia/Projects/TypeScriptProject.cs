namespace Aigamo.Petunia.Projects;

internal abstract class TypeScriptProject : Project
{
	internal string GeneratePrettierRcJson()
	{
		var obj = new JsonObject()
			.AddEntry("singleQuote", true)
			.AddEntry("trailingComma", "all")
			.AddEntry(
				"importOrder",
				new JsonArray()
					.AddItem("^@core/(.*)$")
					.AddItem("^@server/(.*)$")
					.AddItem("^@ui/(.*)$")
					.AddItem("^[./]")
			)
			.AddEntry("importOrderSeparation", true)
			.AddEntry("importOrderSortSpecifiers", true);

		return $"{obj.ToFormattedString(new())}{Constants.NewLine}";
	}
}
