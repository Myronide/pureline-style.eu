# C# Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) with this profile. C# is a managed, brace-based language with strong compiler support. Pureline C# targets **.NET 8** or later.

## C# Profile

### PL-CS-001 — Naming Follows the .NET Convention

Use `PascalCase` for types, members, and constants, `camelCase` for locals and parameters, and `_camelCase` for private fields. Names state the role of a value, not its type.

```csharp
public static class SessionRules
{
    public static bool IsExpired(DateTimeOffset lastSeen, TimeSpan maxAge) =>
        DateTimeOffset.UtcNow - lastSeen > maxAge;
}
```

### PL-CS-002 — Nullable Reference Types Are On

Set `<Nullable>enable</Nullable>` in every project. `string` never holds null, and `string?` declares that it may. Do not silence the compiler with `!`; fix the flow instead.

```csharp
public sealed class UserProfile
{
    public required string Name { get; init; }
    public string? Nickname { get; init; }
}
```

Prefer `?.` with `??` when the only purpose of the null check is to select
a fallback. In this example, `Name` is non-nullable.

```text
− Separate null guard            │ ✓ Pureline
if (user is null) {              │ return user?.Name ?? "Gast";
    return "Gast";               │
}                                │
                                 │
return user.Name;                │
```

### PL-CS-003 — Records for Immutable Data

Model data that moves between layers as a `record`. Derive changed copies with `with` instead of mutating. Use a class only when the object has identity or behaviour of its own.

```csharp
public sealed record Session(string Id, string Title, bool IsActive);

public static Session Rename(Session session, string title) =>
    session with { Title = title };
```

### PL-CS-004 — Guard Clauses Return Early

Check invalid input first and return immediately, so the main path stays at the outer indentation level with no `else`. See [control flow](../core/control-flow.md).

```csharp
public static decimal Discount(decimal total)
{
    if (total <= 0)
    {
        return 0;
    }

    return total * 0.1m;
}
```

### PL-CS-005 — Dispose with `using` Declarations

Use a `using` declaration so disposal happens at the end of the enclosing scope. Each `IDisposable` has one owner, and that owner disposes it.

```csharp
public static string ReadFirstLine(string path)
{
    using var reader = new StreamReader(path);
    return reader.ReadLine() ?? string.Empty;
}
```

### PL-CS-006 — Async All the Way with Task

Return `Task` or `Task<T>`, suffix the name with `Async`, accept a `CancellationToken`, and never block with `.Result` or `.Wait()`. Use `ValueTask` only where a measurement justifies it.

```csharp
public static async Task<string> LoadBodyAsync(HttpClient client, string url, CancellationToken ct)
{
    using var response = await client.GetAsync(url, ct);
    return await response.Content.ReadAsStringAsync(ct);
}
```

### PL-CS-007 — LINQ Only When It Reads Clearly

Use LINQ for one linear transformation: a filter, a projection, or a materialization. Switch to a `foreach` loop when the query has side effects, branches, or more than three chained operators.

```csharp
public static List<string> ActiveTitles(IEnumerable<Session> sessions) =>
    sessions.Where(s => s.IsActive).Select(s => s.Title).ToList();
```

### PL-CS-008 — Namespace per Folder, Bounded Folder Density

The namespace mirrors the folder path, so `Sessions/Views/` uses `Acme.Sessions.Views`. A folder holds at most **10 hand-maintained source files** by default. Group by feature rather than by kind, and exceed the limit only when every file serves one responsibility (cohesion over size, see [structure](../core/structure.md)).

```csharp
namespace Acme.Sessions.Views;

public sealed class SessionCard
{
    public required string Title { get; init; }
}
```

### PL-CS-009 — Tooling

Run `dotnet format --verify-no-changes` in CI as the official formatter. Enable the Roslyn analyzers and add StyleCop.Analyzers for naming and ordering rules, keep warnings intentional, and test behaviour with xUnit or NUnit (see [tooling](../tooling.md)).

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```
