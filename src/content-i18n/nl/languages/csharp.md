# C# Codestijl

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) toe met dit profiel. C# is een managed, op braces gebaseerde taal met sterke compiler ondersteuning. Pureline C# richt zich op **.NET 8** of later.

## C# Profile

### PL-CS-001. Naamgeving volgt de.NET-overeenkomst

Gebruik `PascalCase` voor types, leden en constanten, `camelCase` voor lokalen en parameters, en `_camelCase` voor privé-velden. Namen geven de rol van een waarde aan, niet het type ervan.

```csharp
public static class SessionRules
{
    public static bool IsExpired(DateTimeOffset lastSeen, TimeSpan maxAge) =>
        DateTimeOffset.UtcNow - lastSeen > maxAge;
}
```

### PL-CS-002. Nullable referentietypes zijn ingeschakeld

Stel `<Nullable>enable</Nullable>` in in elk project. `string` heeft nooit nul, en `string?` verklaart dat het mag. De compiler met `!` niet stilzetten; de flow in plaats daarvan repareren.

```csharp
public sealed class UserProfile
{
    public required string Name { get; init; }
    public string? Nickname { get; init; }
}
```

`?.` verkiest `??` als het enige doel van de nulcontrole is om te selecteren
a fallback. In dit voorbeeld is `Name` niet-nullable.

```text
− Separate null guard            │ ✓ Pureline
if (user is null) {              │ return user?.Name ?? "Gast";
    return "Gast";               │
}                                │
                                 │
return user.Name;                │
```

### PL-CS-003. Records voor onveranderlijke gegevens

Modelgegevens die tussen lagen als `record` bewegen. Derive veranderde kopieën met `with` in plaats van met de naam van de zender. Gebruik een klasse alleen als het object een eigen identiteit of gedrag heeft.

```csharp
public sealed record Session(string Id, string Title, bool IsActive);

public static Session Rename(Session session, string title) =>
    session with { Title = title };
```

### PL-CS-004. Bewakersclausules worden vroeg teruggestuurd

Controleer ongeldige invoer eerst en geef onmiddellijk terug, zodat het hoofdpad blijft op het buitenste inspringniveau zonder `else`. Zie [controlestroom](../core/control-flow.md).

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

### PL-CS-005. Gooi met `using` Declarations

Gebruik een `using` verklaring zodat verwijdering gebeurt aan het einde van de omsluiten scope. Elke `IDisposable` heeft één eigenaar en die eigenaar heeft het.

```csharp
public static string ReadFirstLine(string path)
{
    using var reader = new StreamReader(path);
    return reader.ReadLine() ?? string.Empty;
}
```

### PL-CS-006. Async Helemaal met taak

Geef `Task` of `Task<T>` terug, bevestig de naam met `Async`, accepteer een `CancellationToken` en blokkeer nooit met `.Result` of `.Wait()`. Gebruik `ValueTask` alleen als een meting het rechtvaardigt.

```csharp
public static async Task<string> LoadBodyAsync(HttpClient client, string url, CancellationToken ct)
{
    using var response = await client.GetAsync(url, ct);
    return await response.Content.ReadAsStringAsync(ct);
}
```

### PL-CS-007. LINQ alleen als het duidelijk leest

Gebruik LINQ voor één lineaire transformatie: een filter, een projectie of een materialisatie. Schakel over op een `foreach`-lus wanneer de query bijwerkingen, branches of meer dan drie geketende operators heeft.

```csharp
public static List<string> ActiveTitles(IEnumerable<Session> sessions) =>
    sessions.Where(s => s.IsActive).Select(s => s.Title).ToList();
```

### PL-CS-008. Naamruimte per map, Gebonden map-dentiteit

De namespace spiegelt het mappenpad, dus `Sessions/Views/` gebruikt `Acme.Sessions.Views`. Een map bevat hooguit **10 hand-onderhoud bronbestanden** standaard. Groep op functie in plaats van op vriendelijke, en overschrijd de limiet alleen wanneer elk bestand dient één verantwoordelijkheid (cohesie over grootte, zie [structuur](../core/structure.md)).

```csharp
namespace Acme.Sessions.Views;

public sealed class SessionCard
{
    public required string Title { get; init; }
}
```

### PL-CS-009. Gereedschape

Run `dotnet format --verify-no-changes` in CI als de officiële ambtenaar. Activeer de Roslyn analysers en voeg StyleCop.Analyzers voor het in- en ordenen van regels, houd waarschuwingen opzettelijk, en test gedrag met xUnit of NUnit (zie [tooling](../tooling.md)).

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```
