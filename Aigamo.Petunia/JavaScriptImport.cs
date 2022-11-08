namespace Aigamo.Petunia;

internal abstract class JavaScriptImport
{
	public string ModuleName { get; }

	protected JavaScriptImport(string moduleName)
	{
		ModuleName = moduleName;
	}

	public sealed class JavaScriptNamedImport : JavaScriptImport
	{
		private readonly List<string> _exports = new();

		public JavaScriptNamedImport(string moduleName)
			: base(moduleName)
		{
		}

		public JavaScriptNamedImport AddExport(string? export)
		{
			if (export is not null) _exports.Add(export);
			return this;
		}

		public JavaScriptNamedImport AddExports(params string?[]? exports)
		{
			if (exports is not null) _exports.AddRange(exports.WhereNotNull());
			return this;
		}

		public override string ToString()
		{
			var exports = string.Join(", ", _exports.Distinct().Order());
			return $"import {{ {exports} }} from '{ModuleName}';";
		}
	}

	public sealed class JavaScriptDefaultImport : JavaScriptImport
	{
		public string DefaultExport { get; }

		public JavaScriptDefaultImport(string moduleName, string defaultExport)
			: base(moduleName)
		{
			DefaultExport = defaultExport;
		}

		public override string ToString()
		{
			return $"import {DefaultExport} from '{ModuleName}';";
		}
	}
}

internal sealed class JavaScriptImports
{
	private readonly List<JavaScriptImport> _imports = new();

	public JavaScriptImports AddImport(JavaScriptImport? import)
	{
		if (import is not null) _imports.Add(import);
		return this;
	}

	public JavaScriptImports AddImports(params JavaScriptImport?[]? imports)
	{
		if (imports is not null) _imports.AddRange(imports.WhereNotNull());
		return this;
	}

	public override string ToString()
	{
		return string.Join("\n", _imports.OrderBy(import => import.ModuleName));
	}
}
