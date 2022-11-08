using System.Text;

namespace Aigamo.Petunia;

internal abstract record JsonValue
{
	public enum FormatStyle
	{
		Json,
		JavaScript,
	}

	public sealed record FormatOptions(
		string Tab = "\t",
		string NewLine = "\n",
		FormatStyle Style = FormatStyle.Json
	);

	protected virtual string ToFormattedString(FormatOptions options, int tabCount)
	{
		return ToString();
	}

	public string ToFormattedString(FormatOptions options)
	{
		return ToFormattedString(options, tabCount: 0);
	}

	public sealed record JsonLiteral(string Value) : JsonValue
	{
		public override string ToString()
		{
			return Value.ToString();
		}
	}

	public sealed record JsonUndefined : JsonValue
	{
		public override string ToString()
		{
			return "undefined";
		}
	}

	public sealed record JsonNull : JsonValue
	{
		public override string ToString()
		{
			return "null";
		}
	}

	public sealed record JsonBoolean(bool Value) : JsonValue
	{
		public override string ToString()
		{
			return Value ? "true" : "false";
		}
	}

	public sealed record JsonNumber(int Value) : JsonValue
	{
		public override string ToString()
		{
			return Value.ToString();
		}
	}

	public sealed record JsonString(string Value) : JsonValue
	{
		public override string ToString()
		{
			return $@"""{Value}""";
		}

		protected override string ToFormattedString(FormatOptions options, int tabCount)
		{
			return options.Style switch
			{
				FormatStyle.Json => $@"""{Value}""",
				FormatStyle.JavaScript => $"'{Value}'",
				_ => throw new InvalidOperationException($"Invalid {nameof(FormatOptions.Style)}: {options.Style}")
			};
		}
	}

	public sealed record JsonArray : JsonValue
	{
		public List<JsonValue> Items { get; init; } = new();

		public JsonArray AddItem(JsonValue item)
		{
			Items.Add(item);
			return this;
		}

		public override string ToString()
		{
			return $"[{string.Join(",", Items)}]";
		}

		protected override string ToFormattedString(FormatOptions options, int tabCount)
		{
			static string ItemToString(JsonValue item, FormatOptions options, int tabCount)
			{
				var indent = string.Concat(Enumerable.Repeat(options.Tab, tabCount));
				return $"{indent}{item.ToFormattedString(options, tabCount)}";
			}

			static string ItemsToString(IEnumerable<JsonValue> items, FormatOptions options, int tabCount)
			{
				var builder = new StringBuilder();

				builder.Append(string.Join(
					$",{options.NewLine}",
					items.Select(item => ItemToString(item, options, tabCount))
				));

				if (options.Style == FormatStyle.JavaScript)
				{
					builder.Append(',');
				}

				return builder.ToString();
			}

			var indent = string.Concat(Enumerable.Repeat(options.Tab, tabCount));
			return Items.Any()
				? $$"""
					[{{options.NewLine}}{{ItemsToString(Items, options, tabCount + 1)}}{{options.NewLine}}{{indent}}]
					"""
				: "[]";
		}
	}

	public sealed record JsonObject : JsonValue
	{
		public List<KeyValuePair<string, JsonValue>> Entries { get; init; } = new();

		public JsonObject AddEntry(string key, JsonValue? value)
		{
			if (value is not null) Entries.Add(new(key, value));
			return this;
		}

		public override string ToString()
		{
			return $"{{{string.Join(",", Entries.Select(entry => $@"""{entry.Key}"":{entry.Value}"))}}}";
		}

		protected override string ToFormattedString(FormatOptions options, int tabCount)
		{
			static string EntryToString(KeyValuePair<string, JsonValue> entry, FormatOptions options, int tabCount)
			{
				var builder = new StringBuilder();

				var indent = string.Concat(Enumerable.Repeat(options.Tab, tabCount));
				builder.Append(indent);

				switch (options.Style)
				{
					case FormatStyle.Json:
						builder.Append('"');
						builder.Append(entry.Key);
						builder.Append('"');
						break;

					case FormatStyle.JavaScript:
						if (entry.Key.Contains('-'))
						{
							builder.Append('\'');
							builder.Append(entry.Key);
							builder.Append('\'');
						}
						else
						{
							builder.Append(entry.Key);
						}
						break;
				}

				builder.Append($": {entry.Value.ToFormattedString(options, tabCount)}");

				return builder.ToString();
			}

			static string EntriesToString(IEnumerable<KeyValuePair<string, JsonValue>> entries, FormatOptions options, int tabCount)
			{
				var builder = new StringBuilder();

				builder.Append(string.Join(
					$",{options.NewLine}",
					entries.Select(entry => EntryToString(entry, options, tabCount))
				));

				if (options.Style == FormatStyle.JavaScript)
				{
					builder.Append(',');
				}

				return builder.ToString();
			}

			var indent = string.Concat(Enumerable.Repeat(options.Tab, tabCount));
			return Entries.Any()
				? $$"""
					{{{options.NewLine}}{{EntriesToString(Entries, options, tabCount + 1)}}{{options.NewLine}}{{indent}}}
					"""
				: "{}";
		}
	}
}

internal static class JsonArrayExtensions
{
	public static JsonArray AddItem(this JsonArray source, bool value)
	{
		return source.AddItem(new JsonBoolean(value));
	}

	public static JsonArray AddItem(this JsonArray source, int value)
	{
		return source.AddItem(new JsonNumber(value));
	}

	public static JsonArray AddItem(this JsonArray source, string value)
	{
		return source.AddItem(new JsonString(value));
	}
}

internal static class JsonObjectExtensions
{
	public static JsonObject AddEntry(this JsonObject source, string key, bool value)
	{
		return source.AddEntry(key, new JsonBoolean(value));
	}

	public static JsonObject AddEntry(this JsonObject source, string key, int value)
	{
		return source.AddEntry(key, new JsonNumber(value));
	}

	public static JsonObject AddEntry(this JsonObject source, string key, string value)
	{
		return source.AddEntry(key, new JsonString(value));
	}
}
