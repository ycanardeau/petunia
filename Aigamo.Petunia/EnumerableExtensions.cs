namespace Aigamo.Petunia;

public static class EnumerableExtensions
{
	// Code from https://github.com/dotnet/roslyn/blob/8f24ed69cbbf377573c403d6c8febbc92b560343/src/Compilers/Core/Portable/InternalUtilities/EnumerableExtensions.cs#L287
	public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> source)
		where T : class
	{
		if (source is null)
			return Array.Empty<T>();

		return source.Where(x => x is not null)!;
	}
}
