# C# Code-Stil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) mit diesem Profil an. C# ist eine verwaltete, auf Klammern basierende Sprache mit starker Compiler-Unterstützung. Pureline C# zielt auf **.NET 8** oder höher.

## C# Profil

### PL-CS-001 — Benennung folgt dem.NET-Übereinkommen

Verwenden Sie `PascalCase` für Typen, Mitglieder und Konstanten, `camelCase` für lokale und Parameter und `_camelCase` für private Felder. Namen geben die Rolle eines Wertes, nicht dessen Typ an.

```csharp
public static class SessionRules
{
    public static bool IsExpired(DateTimeOffset lastSeen, TimeSpan maxAge) =>
        DateTimeOffset.UtcNow - lastSeen > maxAge;
}
```

### PL-CS-002 — Nullfähige Referenztypen sind eingeschaltet

Setzen Sie `<Nullable>enable</Nullable>` in jedem Projekt. `string` hält nie null, und `string?` erklärt, dass es kann. Nicht den Compiler mit `!` stummen; stattdessen den Flow beheben.

```csharp
public sealed class UserProfile
{
    public required string Name { get; init; }
    public string? Nickname { get; init; }
}
```

Bevorzugen Sie `?.` mit `??`, wenn der einzige Zweck der Null-Prüfung die Auswahl ist
Ein Rückfall. In diesem Beispiel ist `Name` nicht-nullierbar.

```text
− Separate null guard            │ ✓ Pureline
if (user is null) {              │ return user?.Name ?? "Gast";
    return "Gast";               │
}                                │
                                 │
return user.Name;                │
```

### PL-CS-003 — Aufzeichnungen für unveränderliche Daten

Modelldaten, die sich als `record` zwischen den Schichten bewegen. Derive änderte Kopien mit `with` statt mutierend. Verwenden Sie eine Klasse nur, wenn das Objekt eigene Identität oder Verhalten hat.

```csharp
public sealed record Session(string Id, string Title, bool IsActive);

public static Session Rename(Session session, string title) =>
    session with { Title = title };
```

### PL-CS-004 — Wachklauseln kommen früh zurück

Kontrolliere zuerst ungültige Eingaben und kehre sofort zurück, so dass der Hauptpfad auf der äußeren Einrückungsebene ohne `else` bleibt. Siehe [Kontrollfluss](../core/control-flow.md).

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

### PL-CS-005 — Mit `using`-Erklärungen absetzen

Verwenden Sie eine `using`-Erklärung, so dass die Entsorgung am Ende des Enclosing-Scope geschieht. Jeder `IDisposable` hat einen Besitzer, und dieser Eigentümer veräußert ihn.

```csharp
public static string ReadFirstLine(string path)
{
    using var reader = new StreamReader(path);
    return reader.ReadLine() ?? string.Empty;
}
```

### PL-CS-006 — Async mit der Aufgabe

`Task` oder `Task<T>` zurückgeben, den Namen mit `Async` suffixen, ein `CancellationToken` akzeptieren und niemals mit `.Result` oder `.Wait()` blockieren. Verwenden Sie `ValueTask` nur dort, wo eine Messung es rechtfertigt.

```csharp
public static async Task<string> LoadBodyAsync(HttpClient client, string url, CancellationToken ct)
{
    using var response = await client.GetAsync(url, ct);
    return await response.Content.ReadAsStringAsync(ct);
}
```

### PL-CS-007 — LINQ nur, wenn es sich eindeutig liest

Verwenden Sie LINQ für eine lineare Transformation: einen Filter, eine Projektion oder eine Materialisierung. Wechseln Sie zu einer `foreach`-Schleife, wenn die Abfrage Nebenwirkungen, Zweige oder mehr als drei verkettete Operatoren aufweist.

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

### PL-CS-009 — Werkzeugbau

Run `dotnet format --verify-no-changes` in CI as the official formatter. Enable the Roslyn analyzers and add StyleCop.Analyzers for naming and ordering rules, keep warnings intentional, and test behaviour with xUnit or NUnit (see [tooling](../tooling.md)).

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```
