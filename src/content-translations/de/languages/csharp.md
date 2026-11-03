# C# Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) mit diesem Profil an. C# ist eine verwaltete, klammerbasierte Sprache mit starker Compiler-Unterstützung. Pureline C# zielt auf **.NET 8** oder neuer.

## C#-Profil {#c-profile}

### PL-CS-001 — Die Benennung folgt der .NET-Konvention {#pl-cs-001--naming-follows-the-net-convention}

Verwende `PascalCase` für Typen, Member und Konstanten, `camelCase` für lokale Variablen und Parameter und `_camelCase` für private Felder. Namen geben die Rolle eines Werts an, nicht seinen Typ.

```csharp
public static class SessionRules
{
    public static bool IsExpired(DateTimeOffset lastSeen, TimeSpan maxAge) =>
        DateTimeOffset.UtcNow - lastSeen > maxAge;
}
```

### PL-CS-002 — Nullable Reference Types sind aktiviert {#pl-cs-002--nullable-reference-types-are-on}

Setze `<Nullable>enable</Nullable>` in jedem Projekt. `string` enthält nie null, und `string?` deklariert, dass es null sein darf. Bringe den Compiler nicht mit `!` zum Schweigen; korrigiere stattdessen den Fluss.

```csharp
public sealed class UserProfile
{
    public required string Name { get; init; }
    public string? Nickname { get; init; }
}
```

Bevorzuge `?.` mit `??`, wenn die Nullprüfung nur einen Ersatzwert
auswählt. In diesem Beispiel kann `Name` nicht null sein.

```text
− Separate null guard            │ ✓ Pureline
if (user is null) {              │ return user?.Name ?? "Gast";
    return "Gast";               │
}                                │
                                 │
return user.Name;                │
```

### PL-CS-003 — Records für unveränderliche Daten {#pl-cs-003--records-for-immutable-data}

Modelliere Daten, die zwischen Schichten wandern, als `record`. Leite geänderte Kopien mit `with` ab, statt zu mutieren. Verwende eine Klasse nur, wenn das Objekt eine eigene Identität oder ein eigenes Verhalten hat.

```csharp
public sealed record Session(string Id, string Title, bool IsActive);

public static Session Rename(Session session, string title) =>
    session with { Title = title };
```

### PL-CS-004 — Guard Clauses kehren früh zurück {#pl-cs-004--guard-clauses-return-early}

Prüfe ungültige Eingaben zuerst und kehre sofort zurück, damit der Hauptpfad ohne `else` auf der äußeren Einrückungsebene bleibt. Siehe [Kontrollfluss](../core/control-flow.md).

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

### PL-CS-005 — Mit `using`-Deklarationen freigeben {#pl-cs-005--dispose-with-using-declarations}

Verwende eine `using`-Deklaration, damit die Freigabe am Ende des umschließenden Scopes erfolgt. Jedes `IDisposable` hat einen Eigentümer, und dieser Eigentümer gibt es frei.

```csharp
public static string ReadFirstLine(string path)
{
    using var reader = new StreamReader(path);
    return reader.ReadLine() ?? string.Empty;
}
```

### PL-CS-006 — Durchgängig async mit Task {#pl-cs-006--async-all-the-way-with-task}

Gib `Task` oder `Task<T>` zurück, hänge das Suffix `Async` an den Namen, akzeptiere ein `CancellationToken` und blockiere niemals mit `.Result` oder `.Wait()`. Verwende `ValueTask` nur dort, wo eine Messung es rechtfertigt.

```csharp
public static async Task<string> LoadBodyAsync(HttpClient client, string url, CancellationToken ct)
{
    using var response = await client.GetAsync(url, ct);
    return await response.Content.ReadAsStringAsync(ct);
}
```

### PL-CS-007 — LINQ nur, wenn es klar lesbar ist {#pl-cs-007--linq-only-when-it-reads-clearly}

Verwende LINQ für eine lineare Transformation: einen Filter, eine Projektion oder eine Materialisierung. Wechsle zu einer `foreach`-Schleife, wenn die Abfrage Seiteneffekte, Verzweigungen oder mehr als drei verkettete Operatoren hat.

```csharp
public static List<string> ActiveTitles(IEnumerable<Session> sessions) =>
    sessions.Where(s => s.IsActive).Select(s => s.Title).ToList();
```

### PL-CS-008 — Ein Namespace pro Ordner, begrenzte Ordnerdichte {#pl-cs-008--namespace-per-folder-bounded-folder-density}

Der Namespace spiegelt den Ordnerpfad, also verwendet `Sessions/Views/` den Namespace `Acme.Sessions.Views`. Ein Ordner enthält standardmäßig höchstens **10 von Hand gepflegte Quelldateien**. Gruppiere nach Feature statt nach Art, und überschreite das Limit nur, wenn jede Datei einer einzigen Verantwortung dient (Kohäsion vor Größe, siehe [Struktur](../core/structure.md)).

```csharp
namespace Acme.Sessions.Views;

public sealed class SessionCard
{
    public required string Title { get; init; }
}
```

### PL-CS-009 — Tooling {#pl-cs-009--tooling}

Führe in der CI `dotnet format --verify-no-changes` als offiziellen Formatter aus. Aktiviere die Roslyn-Analyzer und ergänze StyleCop.Analyzers für Regeln zu Benennung und Reihenfolge, halte Warnungen bewusst und teste das Verhalten mit xUnit oder NUnit (siehe [Tooling](../tooling.md)).

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```
