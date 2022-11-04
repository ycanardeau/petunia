using static Aigamo.Petunia.JsonValue;

namespace Aigamo.Petunia;

internal abstract record JsonValue
{
	public sealed record FormatOptions(string Tab = "\t", string NewLine = "\n");

	protected virtual string ToFormattedString(FormatOptions options, int tabCount)
	{
		return ToString();
	}

	public string ToFormattedString(FormatOptions options)
	{
		return ToFormattedString(options, tabCount: 0);
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
				return string.Join(
					$",{options.NewLine}",
					items.Select(item => ItemToString(item, options, tabCount))
				);
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

		public JsonObject AddEntry(string key, JsonValue value)
		{
			Entries.Add(new(key, value));
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
				var indent = string.Concat(Enumerable.Repeat(options.Tab, tabCount));
				return $@"{indent}""{entry.Key}"": {entry.Value.ToFormattedString(options, tabCount)}";
			}

			static string EntriesToString(IEnumerable<KeyValuePair<string, JsonValue>> entries, FormatOptions options, int tabCount)
			{
				return string.Join(
					$",{options.NewLine}",
					entries.Select(entry => EntryToString(entry, options, tabCount))
				);
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
