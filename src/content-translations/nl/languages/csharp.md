# C#-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. C# is een beheerde taal met accolades en sterke compilerondersteuning. Pureline C# richt zich op **.NET 8** of nieuwer.

## C#-profiel {#c-profile}

### PL-CS-001 — Naamgeving volgt de .NET-conventie {#pl-cs-001--naming-follows-the-net-convention}

Gebruik `PascalCase` voor typen, leden en constanten, `camelCase` voor lokale variabelen en parameters, en `_camelCase` voor private velden. Namen geven de rol van een waarde aan, niet het type.

```csharp
public static class SessionRules
{
    public static bool IsExpired(DateTimeOffset lastSeen, TimeSpan maxAge) =>
        DateTimeOffset.UtcNow - lastSeen > maxAge;
}
```

### PL-CS-002 — Nullable reference types staan aan {#pl-cs-002--nullable-reference-types-are-on}

Stel in elk project `<Nullable>enable</Nullable>` in. `string` bevat nooit null en `string?` geeft aan dat het wel kan. Breng de compiler niet het zwijgen op met `!`; repareer in plaats daarvan de stroom.

```csharp
public sealed class UserProfile
{
    public required string Name { get; init; }
    public string? Nickname { get; init; }
}
```

### PL-CS-003 — Records voor onveranderlijke data {#pl-cs-003--records-for-immutable-data}

Modelleer data die tussen lagen beweegt als een `record`. Leid aangepaste kopieën af met `with` in plaats van te muteren. Gebruik een klasse alleen wanneer het object een eigen identiteit of eigen gedrag heeft.

```csharp
public sealed record Session(string Id, string Title, bool IsActive);

public static Session Rename(Session session, string title) =>
    session with { Title = title };
```

### PL-CS-004 — Guard clauses keren vroeg terug {#pl-cs-004--guard-clauses-return-early}

Controleer ongeldige invoer eerst en keer meteen terug, zodat het hoofdpad op het buitenste inspringniveau blijft, zonder `else`. Zie [besturingsstroom](../core/control-flow.md).

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

### PL-CS-005 — Ruim op met `using`-declaraties {#pl-cs-005--dispose-with-using-declarations}

Gebruik een `using`-declaratie, zodat het opruimen aan het einde van de omsluitende scope gebeurt. Elke `IDisposable` heeft één eigenaar, en die eigenaar ruimt hem op.

```csharp
public static string ReadFirstLine(string path)
{
    using var reader = new StreamReader(path);
    return reader.ReadLine() ?? string.Empty;
}
```

### PL-CS-006 — Async tot onderaan met Task {#pl-cs-006--async-all-the-way-with-task}

Retourneer `Task` of `Task<T>`, geef de naam het achtervoegsel `Async`, accepteer een `CancellationToken` en blokkeer nooit met `.Result` of `.Wait()`. Gebruik `ValueTask` alleen waar een meting dat rechtvaardigt.

```csharp
public static async Task<string> LoadBodyAsync(HttpClient client, string url, CancellationToken ct)
{
    using var response = await client.GetAsync(url, ct);
    return await response.Content.ReadAsStringAsync(ct);
}
```

### PL-CS-007 — LINQ alleen wanneer het duidelijk leest {#pl-cs-007--linq-only-when-it-reads-clearly}

Gebruik LINQ voor één lineaire transformatie: een filter, een projectie of een materialisatie. Schakel over op een `foreach`-lus wanneer de query neveneffecten, vertakkingen of meer dan drie aaneengeschakelde operators heeft.

```csharp
public static List<string> ActiveTitles(IEnumerable<Session> sessions) =>
    sessions.Where(s => s.IsActive).Select(s => s.Title).ToList();
```

### PL-CS-008 — Eén namespace per map, begrensde mapdichtheid {#pl-cs-008--namespace-per-folder-bounded-folder-density}

De namespace weerspiegelt het mappad, dus `Sessions/Views/` gebruikt `Acme.Sessions.Views`. Een map bevat standaard maximaal **10 handmatig onderhouden bronbestanden**. Groepeer op feature in plaats van op soort, en overschrijd de limiet alleen wanneer elk bestand één verantwoordelijkheid dient (samenhang boven omvang, zie [structuur](../core/structure.md)).

```csharp
namespace Acme.Sessions.Views;

public sealed class SessionCard
{
    public required string Title { get; init; }
}
```

### PL-CS-009 — Tooling {#pl-cs-009--tooling}

Voer in CI `dotnet format --verify-no-changes` uit als officiële formatter. Schakel de Roslyn-analyzers in en voeg StyleCop.Analyzers toe voor regels over naamgeving en volgorde, houd waarschuwingen bewust en test gedrag met xUnit of NUnit (zie [tooling](../tooling.md)).

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```
