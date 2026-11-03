# C# Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. C# to zarządzany język z nawiasami klamrowymi i silnym wsparciem kompilatora. Pureline C# dotyczy **.NET 8** lub nowszego.

## Profil C# {#c-profile}

### PL-CS-001 — Nazewnictwo zgodne z konwencją .NET {#pl-cs-001--naming-follows-the-net-convention}

Używaj `PascalCase` dla typów, składowych i stałych, `camelCase` dla zmiennych lokalnych i parametrów oraz `_camelCase` dla pól prywatnych. Nazwy określają rolę wartości, a nie jej typ.

```csharp
public static class SessionRules
{
    public static bool IsExpired(DateTimeOffset lastSeen, TimeSpan maxAge) =>
        DateTimeOffset.UtcNow - lastSeen > maxAge;
}
```

### PL-CS-002 — Nullable reference types są włączone {#pl-cs-002--nullable-reference-types-are-on}

Ustaw `<Nullable>enable</Nullable>` w każdym projekcie. `string` nigdy nie przechowuje null, a `string?` deklaruje, że może. Nie uciszaj kompilatora za pomocą `!`; popraw przepływ.

```csharp
public sealed class UserProfile
{
    public required string Name { get; init; }
    public string? Nickname { get; init; }
}
```

### PL-CS-003 — Rekordy dla danych niezmiennych {#pl-cs-003--records-for-immutable-data}

Dane przekazywane między warstwami modeluj jako `record`. Zmienione kopie twórz przez `with`, zamiast mutować. Klasy używaj tylko wtedy, gdy obiekt ma własną tożsamość lub zachowanie.

```csharp
public sealed record Session(string Id, string Title, bool IsActive);

public static Session Rename(Session session, string title) =>
    session with { Title = title };
```

### PL-CS-004 — Guard clauses wracają wcześnie {#pl-cs-004--guard-clauses-return-early}

Najpierw sprawdzaj niepoprawne dane wejściowe i wracaj natychmiast, aby główna ścieżka pozostała na zewnętrznym poziomie wcięcia, bez `else`. Zobacz [przepływ sterowania](../core/control-flow.md).

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

### PL-CS-005 — Zwalniaj zasoby przez deklaracje `using` {#pl-cs-005--dispose-with-using-declarations}

Używaj deklaracji `using`, aby zwolnienie następowało na końcu otaczającego zakresu. Każdy `IDisposable` ma jednego właściciela, i to ten właściciel go zwalnia.

```csharp
public static string ReadFirstLine(string path)
{
    using var reader = new StreamReader(path);
    return reader.ReadLine() ?? string.Empty;
}
```

### PL-CS-006 — Async na całej drodze z Task {#pl-cs-006--async-all-the-way-with-task}

Zwracaj `Task` lub `Task<T>`, dodawaj do nazwy sufiks `Async`, przyjmuj `CancellationToken` i nigdy nie blokuj przez `.Result` ani `.Wait()`. `ValueTask` stosuj tylko tam, gdzie uzasadnia to pomiar.

```csharp
public static async Task<string> LoadBodyAsync(HttpClient client, string url, CancellationToken ct)
{
    using var response = await client.GetAsync(url, ct);
    return await response.Content.ReadAsStringAsync(ct);
}
```

### PL-CS-007 — LINQ tylko wtedy, gdy czyta się go jasno {#pl-cs-007--linq-only-when-it-reads-clearly}

LINQ stosuj dla jednej liniowej transformacji: filtra, projekcji lub materializacji. Przejdź na pętlę `foreach`, gdy zapytanie ma efekty uboczne, rozgałęzienia lub więcej niż trzy połączone operatory.

```csharp
public static List<string> ActiveTitles(IEnumerable<Session> sessions) =>
    sessions.Where(s => s.IsActive).Select(s => s.Title).ToList();
```

### PL-CS-008 — Przestrzeń nazw na folder, ograniczona gęstość folderów {#pl-cs-008--namespace-per-folder-bounded-folder-density}

Przestrzeń nazw odzwierciedla ścieżkę folderu, więc `Sessions/Views/` używa `Acme.Sessions.Views`. Folder domyślnie zawiera co najwyżej **10 ręcznie utrzymywanych plików źródłowych**. Grupuj według funkcji, a nie według rodzaju, i przekraczaj limit tylko wtedy, gdy każdy plik służy jednej odpowiedzialności (spójność ponad rozmiar, zobacz [strukturę](../core/structure.md)).

```csharp
namespace Acme.Sessions.Views;

public sealed class SessionCard
{
    public required string Title { get; init; }
}
```

### PL-CS-009 — Narzędzia {#pl-cs-009--tooling}

W CI uruchamiaj `dotnet format --verify-no-changes` jako oficjalny formatter. Włącz analizatory Roslyn i dodaj StyleCop.Analyzers dla reguł nazewnictwa i kolejności, ostrzeżenia traktuj świadomie, a zachowanie testuj za pomocą xUnit lub NUnit (zobacz [narzędzia](../tooling.md)).

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```
