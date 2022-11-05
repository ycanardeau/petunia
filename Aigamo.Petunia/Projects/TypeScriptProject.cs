namespace Aigamo.Petunia.Projects;

internal abstract class TypeScriptProject : Project
{
	public interface IGeneratePrettierRcJsonOptions
	{
		bool SortImports { get; }
	}

	internal static string GeneratePrettierRcJson(IGeneratePrettierRcJsonOptions options)
	{
		var obj = new JsonObject()
			.AddEntry("singleQuote", true)
			.AddEntry("trailingComma", "all");

		if (options.SortImports)
		{
			obj
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
		}

		return $"{obj.ToFormattedString(new())}{Constants.NewLine}";
	}
}
